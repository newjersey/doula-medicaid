describe("/status", () => {
  it("should show VITE_FLAG_TEST=0 [productionFlags]", () => {
    cy.visit("/status");
    cy.contains('"VITE_FLAG_TEST":"0"');
  });
});
