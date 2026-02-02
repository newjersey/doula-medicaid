# NJ Doula Assistant

Helping doulas start the Fee-for-Service (FFS) application to become an NJ FamilyCare community
doula.

https://www.nj.gov/humanservices/dmahs/info/doulahelp

## Getting Started

Follow https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating to install `nvm`.
Then, install node v24:

```sh
nvm install 24
nvm use 24
```

Install npm packages

```sh
npm install
```

Run the development server:

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
npm test -- "<path to file>" -t "<included in test block name>"
# e.g.
npm test -- "src/app/form/(formSteps)/personal-information/PersonalStep1.test.tsx" -t "updates first name"
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

When running with `--mode test` (as is done with `npm run dev:test`, Vite will first check for a
`.env.test.local` file (gitignored), then `.env.test` (not gitignored). The local file enables us to
make any changes and test with them locally, without having to reset any changes before git
committing.

```sh
cp cypress/.env.test-production-flags .env.test.local

# Restart the Vite process
npm run dev:test

# Then run cypress tests with `[productionFlags]` in their name
npm run cypress:run -- --env productionFlags=true

# To run with cypress GUI
npm run cypress:gui -- --env productionFlags=true
```

The local file may need to be updated if you want to turn flags back on again

```sh
cp .env.test .env.test.local
```

## PDF field overflow

Some fields seem to always truncate any overflow. Other fields vary depending on the pdf client
whether the text size is reduced, or if any overflow is truncated.

E.g.,

- For `fd452managingagentsnametitleline1` on page 19, all pdf clients seem to truncate
- For `fd62aPrintNameTitle` on page 11, MacOS preview will reduce the size of text so that it fits
  the field. However, Chrome on both Mac and Windows will truncate, and Adobe Reader on Windows will
  truncate

The text size, and whether the text size is reduced if the text would

## Deployment

See [deployment.md](./docs/deployment.md).
