module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  transform: { '^.+\\.js$': 'babel-jest' },
  testTimeout: 30000,
};
