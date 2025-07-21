describe("test passes", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("should pass", () => {
    expect(true).to.equal(true);
  });
});
