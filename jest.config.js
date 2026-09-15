/**
 * Jest configuration for Lightning Web Components.
 *
 * `@salesforce/sfdx-lwc-jest` resolves `jest.config.js` from the project root, so this file is
 * CommonJS. It mirrors the reference config in the plugin at config/jest/jest.config.mjs; keep the
 * coverage thresholds in step with `gates.jestCoverageMin` in .vibeforce/config.json, which is
 * what `vf-check jest` enforces.
 *
 * Docs: https://github.com/salesforce/sfdx-lwc-jest#configuration
 */

const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
  ...jestConfig,

  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
    // Add stubs as the project needs them, for example:
    // '^@salesforce/apex$': '<rootDir>/force-app/test/jest-mocks/apex',
    // '^lightning/navigation$': '<rootDir>/force-app/test/jest-mocks/lightning/navigation'
  },

  testPathIgnorePatterns: ['/node_modules/', '/.sfdx/', '/.sf/', '/.vibeforce/'],

  /*
   * Rooted at the package directory, matching the shape the sfdx-lwc-jest
   * preset uses. A `**`-prefixed pattern such as `**|/lwc/**|/*.js` matches
   * nothing when jest reads it from this file, even though micromatch matches
   * it and the same pattern works when passed on the command line, so the
   * explicit prefix is deliberate rather than stylistic.
   */
  collectCoverageFrom: [
    'force-app/main/default/lwc/**/*.js',
    '!force-app/main/default/lwc/**/__tests__/**',
    '!force-app/main/default/lwc/**/*.spec.js',
    // Preview-only bundles: no shipped behaviour, and `vf-check pairing` exempts them too.
    '!force-app/main/default/lwc/*Harness/**',
    '!force-app/main/default/lwc/*Fixtures/**',
  ],
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      functions: 70,
      branches: 65,
    },
  },

  clearMocks: true,
  restoreMocks: true,
  testTimeout: 15000,
};
