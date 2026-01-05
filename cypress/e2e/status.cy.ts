describe("/status", () => {
  it("should show VITE_FLAG_TEST=1", () => {
    cy.visit("/status");
    cy.contains('"VITE_FLAG_TEST":"1"');
  });
});
