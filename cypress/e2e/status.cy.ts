describe("/status", () => {
  it("should show NEXT_PUBLIC_FLAG_TEST=1", () => {
    cy.visit("/status");
    cy.get("main").contains('NEXT_PUBLIC_FLAG_TEST:"1"');
  });
});
