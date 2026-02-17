module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: { '^.+\\.js$': 'babel-jest' },
  moduleFileExtensions: ['js'],
};
