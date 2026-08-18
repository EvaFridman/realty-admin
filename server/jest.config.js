module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  forceExit: true,
  testTimeout: 10000,
};