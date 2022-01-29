/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: [
      "src/**/*.{ts,js}",
  ],
    globals: {
      "ts-jest": {
          tsconfig: "./tsconfig.cjs.json",
      },
  },
};

export default config;