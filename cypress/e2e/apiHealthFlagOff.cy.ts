describe("/api/health", () => {
  it("should return NEXT_PUBLIC_FLAG_TEST=0 [flagsOff]", () => {
    cy.request("GET", "/api/health").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.featureFlags.NEXT_PUBLIC_FLAG_TEST).to.equal("0");
    });
  });
});
