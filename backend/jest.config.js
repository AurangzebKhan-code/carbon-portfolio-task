module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    testPathIgnorePatterns: ['/node_modules/'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    }
  }; 