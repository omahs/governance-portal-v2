/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */

//code coverage
const cypressCoverage = require('@cypress/code-coverage/task');

module.exports = (on, config) => {
  // Add this line to ensure the `env` property exists on the `config` object
  config.env = config.env || {};

  // Make sure to pass the `on` function to the `cypressCoverage` function
  cypressCoverage(on, config);

  // Your other plugin configurations, if any

  return config;
};
