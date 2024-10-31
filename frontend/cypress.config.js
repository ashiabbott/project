const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Your app's base URL
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
    specPattern: 'cypress/integration/**/*.spec.ts',
  },
  env: {
    API_BASE_URL: 'http://localhost:5000/api', // API base URL for Cypress tests
  },
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
});
