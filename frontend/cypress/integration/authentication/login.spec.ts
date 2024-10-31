describe('Login Flow E2E Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in successfully with valid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('securepassword');
    cy.get('button[type="submit"]').click();

    // Assert that user is redirected to the dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });

  it('should show an error message with invalid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Assert that an error message is displayed
    cy.contains('Invalid email or password').should('be.visible');
  });
});
