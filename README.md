# Doula Medicaid

## Getting Started

First, run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test:

```sh
# Run all unit tests
npm test
# Run test in specific file path, matching test description
npm test -- --runTestsByPath "<path to file>" -t "<included in test block name>"
# e.g.
npm test -- --runTestsByPath "src/app/form/(formSteps)/personal-information/PersonalInformationStep1.test.tsx" -t "updates first name"

# Run all e2e tests
npm run cypress:run
# Run cypress tests in a specific file path
npm run cypress:run -- --spec <path to file>
# Open the cypress GUI to debug
npm run cypress:gui
```

# Building a Docker Image

```sh
# Start Colima (Docker Daemon replacement)
colima start

# Navigate to root of repo
# Build Docker image
docker build -t doula-test .
```

# Deploying with CDK

```sh
# set up AWS credentials
aws configure sso

# Bootstrap (once per account)
npx cdk bootstrap

# Check differences
npx cdk diff --profile AWSAdministratorAccess-625512666954

# Synthesize resources
npx cdk deploy DoulaCommonAppStack --profile AWSAdministratorAccess-625512666954

# Destroy resources
npx cdk destroy DoulaCommonAppStack --profile AWSAdministratorAccess-625512666954
```
