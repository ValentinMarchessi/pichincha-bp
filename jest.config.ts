import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
  testPathIgnorePatterns: [
    "<rootDir>[/\\\\](node_modules|.next)[/\\\\]",
    "<rootDir>/__tests__/__mocks__",
    "<rootDir>/__tests__/utils.ts",
  ],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  resetMocks: false,
  automock: false,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)": ["<rootDir>/src/$1"],
    "^@tests/(.*)": ["<rootDir>/__tests__/$1"],
    "^@mocks/(.*)": ["<rootDir>/__tests__/__mocks__/$1"],
    "^.+\\.(css|less|scss|sass)$": "<rootDir>/__tests__/__mocks__/styleMock.ts",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/__tests__",
    "<rootDir>/jest.config.ts",
    "<rootDir>/jest.setup.ts",
  ],
};

export default config;
