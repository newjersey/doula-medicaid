# Engineering accessibility training

## Getting Started

First, run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To tests:

```sh
# Run all tests
npm test

# Run test in specific file path, matching test description
npm test -- --runTestsByPath "<path to file>" -t "<included in test block name>"
# e.g.
npm test -- --runTestsByPath "src/app/form/(formSteps)/personal-information/PersonalInformationStep.test.tsx" -t "updates first name"
```
