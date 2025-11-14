# How to deploy

## Prerequisites

- Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  and [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting-started.html)
- [Configure AWS authentication via SSO](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#cli-configure-sso-session)
- If working locally on the docker container, see
  [Local Docker development](#local-docker-development)
- Log in via SSO and export credentials for the profile, replacing `<profile name>` with the profile
  name for the account:
  - `aws sso login --profile <profile name> && eval "$(aws configure export-credentials --profile <profile name> --format env)"`

## First-time AWS account setup

Create the ECR repository, and OIDC provider for GitHub:

```sh
aws ecr create-repository --repository-name doula-app --region us-east-1
aws ecr put-lifecycle-policy --repository-name doula-app --lifecycle-policy-text '{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep max 2 untagged images",
      "selection": {
        "tagStatus": "untagged",
        "countType": "imageCountMoreThan",
        "countNumber": 2
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}'
aws iam create-open-id-connect-provider --url "https://token.actions.githubusercontent.com" --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" --client-id-list "sts.amazonaws.com"
```

Create a bucket then upload the .env file (".staging.env" or ".production.env") for that
environment, replacing `<account number>`. See `.env-template` for an example env file.

```sh
aws s3api create-bucket --bucket doula-assistant-<account number> --region us-east-1
aws s3 cp .<"staging" or "production">.env s3://doula-assistant-<account number>/configuration/.env
```

Bootstrap cdk, replacing `<profile name>`

```sh
npx cdk bootstrap --profile <profile name>
```

## Deploy the cdk stack

Deploy the cdk stack, replacing `<profile name>` and env `<production or staging>`

```sh
# Run VPC configuration that cannot be done via cdk
npm run configureVpc

npm run cdk:deploy --profile <profile name> --context env=<production or staging>
# Add `--require-approval never` to skip the yes/no
```

The output `DoulaAssistantStack.LoadBalancerUrl` should be accessible from an
[AWS CloudShell environment created within the VPC](https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html).

## Deploy the application

Github actions have been set up to build the docker container and deploy the application to the cdk
stack.

## Update feature flags and environment variables

Update the file at `s3://doula-assistant-<account number>/configuration/.env`, replacing account
number. Then, deploy a new ECS task.

```sh
aws s3 cp .<"staging" or "production">.env s3://doula-assistant-<account number>/configuration/.env
aws ecs update-service --cluster doula-assistant-cluster --service doula-assistant-service --force-new-deployment
```

Environment variables for the Amplify deployment are
[set via the Amplify console](https://docs.aws.amazon.com/amplify/latest/userguide/setting-env-vars.html).
Then, select the deployment and redeploy it.

## Local Docker development

For routine deployment, the docker build and push should be handled by Github actions. If working on
the image locally, the following may be useful.

### Installation

Docker Desktop
[requires licenses for government entities](https://docs.docker.com/subscription/desktop-license/),
and as of writing we do not have a license.

On Debian/Ubuntu and Windows Subsystem for Linux, Docker CLI and Docker Engine can be installed
without Docker Desktop:

```sh
curl -fsSL https://get.docker.com/ | sh
```

On MacOS, Docker Engine is difficult to install without Docker Desktop. We instead use
[Colima](https://github.com/abiosoft/colima) as an open source replacement for Docker Engine:

```sh
# As of writing `brew install docker` installs Docker CLI, but not Docker Engine
brew install colima docker
mkdir ~/.docker
cat >~/.docker/config.json <<EOF
  "cliPluginsExtraDirs": [
      "/opt/homebrew/lib/docker/cli-plugins"
  ]
EOF
brew services start colima
```

### Usage tips

To log docker into ECR (replace account number and region):

```sh
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account number>.dkr.ecr.<region>.amazonaws.com
```

If building on an Apple Silicon Mac, `--platform linux/amd64` must be specified when running
`docker build`:

```sh
docker build -t doula-app . --platform linux/amd64
```

## Manually build and deploy to ECS from local

Build and push, replacing `<account number>` and including `--platform linux/amd64` if needed (see
above)

```sh
docker build -t doula-app-main . && docker tag doula-app-main:latest <account number>.dkr.ecr.us-east-1.amazonaws.com/doula-app:latest && docker push <account number>.dkr.ecr.us-east-1.amazonaws.com/doula-app:latest
```

Update ECS

```sh
aws ecs update-service --cluster doula-assistant-cluster --service doula-assistant-service --force-new-deployment
```

## Debugging the deployed ECS container

The task container on ECS can be exec-ed into. First,
[install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

Then, deploy a new task with `--enable-execute-command`

```sh
aws ecs update-service --cluster doula-assistant-cluster --service doula-assistant-service --enable-execute-command --force-new-deployment
```

Once the task is running, wait a few moments, then run the command below, replacing task id

```sh
aws ecs describe-tasks --cluster doula-assistant-cluster --tasks <task id>
```

Verify that the ExecuteCommandAgent is running on the task, by checking that the snippet below is
present in the output of the command above. It might take a few seconds.

```json
"managedAgents": [
    {
        "lastStartedAt": "<timestamp>",
        "name": "ExecuteCommandAgent",
        "lastStatus": "RUNNING"
    }
],
```

Then, exec into the container, replacing task id

```sh
aws ecs execute-command --cluster doula-assistant-cluster --interactive --task <task id> --command /bin/sh
```
