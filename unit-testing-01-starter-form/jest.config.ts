import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  clearMocks: true, //mock calls and instances are reset before each tests
  collectCoverage: true,
  coverageDirectory: "coverage", //coverage report saved here
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], //run this file after seting up test environment but before tests, below ! means exclude
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/out/**",
    "!**/build/**",
    "!**/next-env.d.ts",
    "!**/jest.config.ts",
    "!**/jest.setup.ts",
    "!**/__test__/**",
    "!**/coverage/**",
    "!**/public/**",
    "!**/next.config.ts",
    "!**/app/layout.tsx",
    "!**/app/**",
    "!**/types/**",
  ],

  moduleNameMapper: {
    // ...
    "^@/components/(.*)$": "<rootDir>/components/$1",
  },
};

export default createJestConfig(config);
