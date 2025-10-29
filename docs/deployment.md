# How to deploy

## Prerequisites

- Install Docker CLI, and Colima (Mac) or Docker Enginer (Linux)
- Install AWS CLI https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configure AWS authentication via SSO
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#cli-configure-sso-session
- Log in via SSO and export credentials for the profile, replacing `<profile name>` with the profile
  name for the account:
  `aws sso login --profile <profile name> && eval "$(aws configure export-credentials --profile <profile name> --format env)"`

## First-time AWS account setup

Create the ECR repository

```sh
aws ecr create-repository --repository-name doula-app --region us-east-1
```

Bootstrap cdk, replacing `<profile name>`

```sh
npx cdk bootstrap --profile <profile name>
```

## Build and push the docker image

Log docker into ECR, replacing account number and region

```sh
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account number>.dkr.ecr.<region>.amazonaws.com
```

Checkout the branch you want to deploy. Then build and tag the image, replacing account number and
region.

```sh
docker build -t doula-app .
# Or, if running on an Apple Silicon Mac:
docker build -t doula-app . --platform linux/amd64

docker tag doula-app:latest <account number>.dkr.ecr.<region>.amazonaws.com/doula-app:latest
docker push <account number>.dkr.ecr.<region>.amazonaws.com/doula-app:latest
```

## Deploy the cdk stack

Deploy the cdk stack, replacing `<profile name>`

```sh
# Run configuration that cannot be done via cdk
npm run configureVpc

# Add `--require-approval never` to skip the yes/no
npm run cdk:deploy --profile <profile name>
```

The output `DoulaAssistantStack.LoadBalancerUrl` should be accessible from an
[AWS CloudShell environment created within the VPC](https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html).
