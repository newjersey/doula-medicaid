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

Bootstrap cdk, replacing `<profile name>`

```sh
npx cdk bootstrap --profile <profile name>
```

## Deploy the cdk stack

Deploy the cdk stack, replacing `<profile name>`

```sh
# Run VPC configuration that cannot be done via cdk
npm run configureVpc

npm run cdk:deploy --profile <profile name>
# Add `--require-approval never` to skip the yes/no
```

The output `DoulaAssistantStack.LoadBalancerUrl` should be accessible from an
[AWS CloudShell environment created within the VPC](https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html).

## Deploy the application

Github actions have been set up to build the docker container and deploy the application to the cdk
stack.

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
