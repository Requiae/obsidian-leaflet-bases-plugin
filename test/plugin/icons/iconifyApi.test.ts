import { IconifyInfo } from "@iconify/types";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { filterCollectionEntries, IconifyCollections, toCollectionEntries } from "@plugin/icons/iconifyApi";

vi.mock("obsidian", () => ({ requestUrl: vi.fn() }));

function buildInfo(overrides: Partial<IconifyInfo> = {}): IconifyInfo {
	return {
		name: "Material Design Icons",
		author: { name: "Austin Andrews" },
		license: { title: "Apache 2.0" },
		...overrides,
	};
}

function buildCollections(): IconifyCollections {
	return { mdi: buildInfo() };
}

// getIconifyCollections caches at module scope, so each test needs a fresh module
// instance to observe caching/retry behaviour in isolation. The mocked `requestUrl`
// itself is a singleton across resetModules() calls, so its call history is cleared too.
async function importIconifyApi() {
	vi.resetModules();
	const { requestUrl } = await import("obsidian");
	(requestUrl as Mock).mockReset();
	return { ...(await import("@plugin/icons/iconifyApi")), requestUrl: requestUrl as Mock };
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

describe("Get iconify collections function", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	test("returns the parsed collections on a successful fetch", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		const collections = buildCollections();
		requestUrl.mockResolvedValue({ status: 200, json: collections });

		expect(await getIconifyCollections()).toEqual(collections);
	});

	test("caches a successful fetch instead of re-requesting", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		requestUrl.mockResolvedValue({ status: 200, json: buildCollections() });

		await getIconifyCollections();
		await getIconifyCollections();

		expect(requestUrl).toHaveBeenCalledTimes(1);
	});

	test("returns null without throwing on a non-200 response", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		requestUrl.mockResolvedValue({ status: 500, text: "boom" });

		expect(await getIconifyCollections()).toBeNull();
	});

	test("returns null when the response does not match the expected shape", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		requestUrl.mockResolvedValue({ status: 200, json: { mdi: { name: "Material Design Icons" } } });

		expect(await getIconifyCollections()).toBeNull();
	});

	test("returns null without throwing when the request throws", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		requestUrl.mockRejectedValue(new Error("network down"));

		expect(await getIconifyCollections()).toBeNull();
	});

	test("retries with a new request after a failed fetch instead of caching the failure", async () => {
		const { getIconifyCollections, requestUrl } = await importIconifyApi();
		const collections = buildCollections();
		requestUrl
			.mockResolvedValueOnce({ status: 500, text: "boom" })
			.mockResolvedValueOnce({ status: 200, json: collections });

		expect(await getIconifyCollections()).toBeNull();
		expect(await getIconifyCollections()).toEqual(collections);
		expect(requestUrl).toHaveBeenCalledTimes(2);
	});
});

describe("Get iconify icon set function", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	test("returns the parsed icon set on a successful fetch", async () => {
		const { getIconifyIconSet, requestUrl } = await importIconifyApi();
		const iconSet = { prefix: "mdi", icons: {} };
		requestUrl.mockResolvedValue({ status: 200, json: iconSet });

		expect(await getIconifyIconSet("mdi")).toEqual(iconSet);
	});

	test("returns null without throwing on a non-200 response", async () => {
		const { getIconifyIconSet, requestUrl } = await importIconifyApi();
		requestUrl.mockResolvedValue({ status: 404, text: "not found" });

		expect(await getIconifyIconSet("mdi")).toBeNull();
	});

	test("returns null without throwing when the request throws", async () => {
		const { getIconifyIconSet, requestUrl } = await importIconifyApi();
		requestUrl.mockRejectedValue(new Error("network down"));

		expect(await getIconifyIconSet("mdi")).toBeNull();
	});
});
