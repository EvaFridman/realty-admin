module.exports = {
  preset: "ts-jest",
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  forceExit: true,
  testTimeout: 10000,
};