/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: [
      "ts", "js",
      <% if (react) { %>"tsx", "jsx",<% } %>
    ],
    setupFilesAfterEnv: ["<rootDir>/src/config/setupTests.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: [
      // Include patterns
      "src/**/*.{ts,js}",
      <% if (react) { %>"src/**/*.{tsx,jsx}",<% } %>
      // Excldue patterns
      "!**/*.d.ts",
      <% if (react) { %>"!src/index.tsx",<% } %>
    ],
    globals: {
      "ts-jest": {
        tsconfig: "./tsconfig.cjs.json",
      },
    },
  <% if (react) { %>testEnvironment: "jest-environment-jsdom",<% } %>
};

export default config;