/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'api/src/**/*.{js,jsx,ts,tsx}',
    'graphql/src/**/*.{js,jsx,ts,tsx}',
    'www/src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/lib/$1',
  },
};
