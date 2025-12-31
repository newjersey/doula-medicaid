describe("/status", () => {
  it("should show VITE_FLAG_TEST=1", () => {
    cy.visit("/status");
    cy.get("main").contains('VITE_FLAG_TEST:"1"');
  });
});
