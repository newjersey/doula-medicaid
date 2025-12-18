it("should prevent access to the website and display a message instead [websiteUnavailable]", () => {
  cy.visit("/");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/welcome`);
  cy.contains("Official Site of the State of New Jersey").should("exist");
  cy.contains("The NJ Doula Assistant is currently unavailable.").should("exist");
  cy.contains("This tool is a work in progress").should("not.exist");

  cy.visit("/form/personal/1");
  cy.contains("Official Site of the State of New Jersey").should("exist");
  cy.get("main").invoke("text").should("equal", "");
});
