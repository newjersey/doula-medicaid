# Doula Medicaid

## Getting Started

Follow https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating to install `nvm`.
Then, install node v20:

```sh
nvm install 20
```

First, install npm packages

```sh
npm install
```

Second, run the development server:

```sh
npm run dev
```

Open
[http://localhost:3000/humanservices/dmahs/info/doulahelp](http://localhost:3000/humanservices/dmahs/info/doulahelp)
with your browser to see the result.

## Running tests

### Unit tests

```sh
# Run all unit tests
npm test
# Run test in specific file path, matching test description
npm test -- --runTestsByPath "<path to file>" -t "<included in test block name>"
# e.g.
npm test -- --runTestsByPath "src/app/form/(formSteps)/personal/PersonalStep1.test.tsx" -t "updates first name"
```

### End to end tests

First, start the development server, using env vars in the .env.test file

```sh
npm run dev:test
```

To run all e2e tests that are not labelled `[productionFlags]`

```sh
npm run cypress:run

# Run cypress tests in a specific file path
npm run cypress:run -- --spec <path to file>

# Open the cypress GUI to debug
npm run cypress:gui
```

To run e2e tests that _are_ labelled `[productionFlags]`, we need to turn environment favorable
flags off.

When running with `NODE_ENV=test` (as is done with `npm run dev:test`, NextJS will first check for a
`.env.test.local` file (gitignored), then `.env.test` (not gitignored). The local file enables us to
make any changes and test with them locally, without having to reset any changes before git
committing.

```sh
cp cypress/.env.test-production-flags .env.test.local

# Restart the NextJS process
npm run dev:test

# Then run cypress tests with `[productionFlags]` in their name
npm run cypress:run:productionFlags

# To run with cypress GUI
npm run cypress:gui:productionFlags
```

The local file may need to be updated if you want to turn flags back on again

```sh
cp .env.test .env.test.local
```

## Deployment

See [deployment.md](./docs/deployment.md).
