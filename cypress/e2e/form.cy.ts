describe('form', () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe('form entry', () => {
    it('is visible', () => {
      cy.contains('Submit').should('be.visible');
    });
  });
});
