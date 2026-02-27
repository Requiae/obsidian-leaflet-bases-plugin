import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"@plugin/": new URL("./src/plugin/", import.meta.url).pathname,
			obsidian: new URL("./test/mocks/obsidian", import.meta.url).pathname,
		},
	},
});
