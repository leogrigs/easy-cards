import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  coverageReporters: ["text", "json", "html", "json-summary"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "providers/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
  ],
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
