// jest.config.js
// Jest測試框架配置

export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/index.css',
    '!src/supabaseClient.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
