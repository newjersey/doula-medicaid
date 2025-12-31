describe("/status", () => {
  it("should return NEXT_PUBLIC_FLAG_TEST=0 [productionFlags]", () => {
    cy.visit("/status");
    cy.get("main").contains('NEXT_PUBLIC_FLAG_TEST:"0"');
  });
});
