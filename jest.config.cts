import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	collectCoverageFrom: ["src/**/*.{js,ts}", "!**/node_modules/**"],
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.ts?$": "ts-jest",
	},
	moduleFileExtensions: ["js", "ts"],
	moduleDirectories: ["node_modules", "src", "test"],
	moduleNameMapper: {
		"@plugin/(.*)": "<rootDir>/src/plugin/$1",
		"@src/(.*)": "<rootDir>/src/$1",
		obsidian: "<rootDir>/test/mocks/obsidian.ts",
	},
	transformIgnorePatterns: ["node_modules"],
	testPathIgnorePatterns: ["node_modules"],
};

export default config;
