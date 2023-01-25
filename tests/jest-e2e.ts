import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  resolver: 'bob-the-bundler/jest-resolver.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
