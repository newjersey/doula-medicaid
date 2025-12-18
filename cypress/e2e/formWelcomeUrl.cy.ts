// We put the home page on /form/welcome instead of / as a matter of tech debt. It was the most convenient thing to do then, and we thought we could always refactor to move it back to /.
// However, public communications, e.g. the press release, have since directly linked to /form/welcome. If we switch the location of the landing page, we need to make sure that /form/welcome redirects to the new location

it("should consider /form/welcome a valid landing page URL", () => {
  cy.visit("/form/welcome");
  cy.contains("Welcome to the NJ Doula Assistant");
  cy.contains("Start now").click();
});

it("should consider /form/welcome a valid landing page URL [productionFlags]", () => {
  cy.visit("/form/welcome");
  cy.contains("Welcome to the NJ Doula Assistant");
  cy.contains("Start now").click();
});
