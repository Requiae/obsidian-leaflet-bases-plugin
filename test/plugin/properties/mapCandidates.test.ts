import { App, TFile } from "obsidian";
import { describe, expect, test } from "vitest";
import { findLeafletMapCandidates } from "@plugin/properties/components/mapCandidates";

function mockFile(path: string, extension: string): TFile {
	return { path, extension } as unknown as TFile;
}

function mockApp(files: TFile[], content: string): App {
	return {
		vault: {
			getFiles: () => files,
			getMarkdownFiles: () => files.filter((file) => file.extension === "md"),
			cachedRead: async () => content,
		},
	} as unknown as App;
}

const leafletMapYaml = ["views:", "  - type: leaflet-map", "    name: My Map", "    image: map.png"].join("\n");

describe("Find leaflet map candidates function", () => {
	test("finds a candidate in a standalone .base file", async () => {
		const file = mockFile("map.base", "base");
		const result = await findLeafletMapCandidates(mockApp([file], leafletMapYaml));

		expect(result).toEqual([expect.objectContaining({ file, viewName: "My Map" })]);
	});

	test("finds a candidate embedded as a code block in a markdown note", async () => {
		const file = mockFile("Note.md", "md");
		const content = ["# My note", "", "```base", leafletMapYaml, "```", ""].join("\n");
		const result = await findLeafletMapCandidates(mockApp([file], content));

		expect(result).toEqual([expect.objectContaining({ file, viewName: "My Map" })]);
	});

	test("finds multiple candidates across multiple embedded code blocks", async () => {
		const file = mockFile("Note.md", "md");
		const otherMapYaml = ["views:", "  - type: leaflet-map", "    name: Other Map", "    image: other.png"].join(
			"\n",
		);
		const content = ["```base", leafletMapYaml, "```", "", "```base", otherMapYaml, "```"].join("\n");
		const result = await findLeafletMapCandidates(mockApp([file], content));

		expect(result).toEqual([
			expect.objectContaining({ file, viewName: "My Map" }),
			expect.objectContaining({ file, viewName: "Other Map" }),
		]);
	});

	test("ignores markdown notes without an embedded base code block", async () => {
		const file = mockFile("Note.md", "md");
		const result = await findLeafletMapCandidates(mockApp([file], "# Just a note\n\nNo maps here."));

		expect(result).toEqual([]);
	});
});
