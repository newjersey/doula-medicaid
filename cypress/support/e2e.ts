// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

const isRelevantSuite = (): boolean => {
  const potentialCypressEnvs = ["productionFlags", "websiteUnavailable", "accessibleCoverPage"];

  const relevantCypressEnvs = potentialCypressEnvs.filter(
    (cypressEnv) => Cypress.env(cypressEnv) === true,
  );

  if (relevantCypressEnvs.length === 0) {
    return potentialCypressEnvs
      .map((cypressEnv) => Cypress.currentTest.title.includes(`[${cypressEnv}]`))
      .every((x) => x === false);
  }

  const titleIncludesAllFlags = relevantCypressEnvs
    .map((cypressEnv) => Cypress.currentTest.title.includes(`[${cypressEnv}]`))
    .every((titleIncludesTag) => titleIncludesTag === true);
  return titleIncludesAllFlags;
};

beforeEach(function () {
  if (!isRelevantSuite()) {
    this.skip();
  }
});
