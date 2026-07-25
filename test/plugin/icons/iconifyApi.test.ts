import { IconifyInfo } from "@iconify/types";
import { describe, expect, test } from "vitest";
import { filterCollectionEntries, IconifyCollections, toCollectionEntries } from "@plugin/icons/iconifyApi";

function buildInfo(overrides: Partial<IconifyInfo> = {}): IconifyInfo {
	return {
		name: "Material Design Icons",
		author: { name: "Austin Andrews" },
		license: { title: "Apache 2.0" },
		...overrides,
	};
}

describe("To collection entries function", () => {
	test("converts a prefix-keyed record into an array of entries", () => {
		const collections: IconifyCollections = {
			mdi: buildInfo({ name: "Material Design Icons" }),
			lucide: buildInfo({ name: "Lucide" }),
		};

		expect(toCollectionEntries(collections)).toEqual([
			{ prefix: "mdi", info: collections.mdi },
			{ prefix: "lucide", info: collections.lucide },
		]);
	});

	test("returns an empty array for an empty record", () => {
		expect(toCollectionEntries({})).toEqual([]);
	});
});

describe("Filter collection entries function", () => {
	const entries = [
		{ prefix: "mdi", info: buildInfo({ name: "Material Design Icons", category: "General" }) },
		{ prefix: "lucide", info: buildInfo({ name: "Lucide", category: "General" }) },
		{ prefix: "tabler", info: buildInfo({ name: "Tabler Icons", category: "UI" }) },
	];

	test("returns all entries when the query is empty", () => {
		expect(filterCollectionEntries(entries, "")).toEqual(entries);
		expect(filterCollectionEntries(entries, "   ")).toEqual(entries);
	});

	test("matches by name case-insensitively", () => {
		expect(filterCollectionEntries(entries, "lucide")).toEqual([entries[1]]);
		expect(filterCollectionEntries(entries, "LUCIDE")).toEqual([entries[1]]);
	});

	test("matches by prefix", () => {
		expect(filterCollectionEntries(entries, "tabler")).toEqual([entries[2]]);
	});

	test("matches by category", () => {
		expect(filterCollectionEntries(entries, "ui")).toEqual([entries[2]]);
	});

	test("returns an empty array when nothing matches", () => {
		expect(filterCollectionEntries(entries, "does not exist")).toEqual([]);
	});
});
