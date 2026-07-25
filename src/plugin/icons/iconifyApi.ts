import { requestUrl } from "obsidian";
import { IconifyInfo } from "@iconify/types";
import { Constants as C } from "@plugin/constants";
import { isIconifyInfo } from "@plugin/icons/iconSchemas";
import { isNonEmptyObject } from "@plugin/util";

export type IconifyCollections = Record<string, IconifyInfo>;

export interface CollectionEntry {
	prefix: string;
	info: IconifyInfo;
}

function isIconifyCollections(value: unknown): value is IconifyCollections {
	return isNonEmptyObject(value) && Object.values(value).every(isIconifyInfo);
}

let collectionsCache: Promise<IconifyCollections | null> | null = null;

export function getIconifyCollections(): Promise<IconifyCollections | null> {
	collectionsCache ??= fetchIconifyCollections().then((result) => {
		// Don't cache a failure — let the next call retry instead of being stuck forever
		if (result === null) collectionsCache = null;
		return result;
	});
	return collectionsCache;
}

export async function getIconifyIconSet(prefix: string): Promise<unknown> {
	const url = `${C.settings.iconify.rawJsonBaseUrl}/${prefix}.json`;
	try {
		const response = await requestUrl({ url, throw: false });
		if (response.status !== 200) {
			console.error(`Iconify request to ${url} failed with status ${response.status}`, response.text);
			return null;
		}

		const json: unknown = response.json;
		if (!isNonEmptyObject(json)) {
			console.error(`Iconify request to ${url} did not return a valid icon set`, json);
			return null;
		}

		return json;
	} catch (error) {
		console.error(`Iconify request to ${url} threw`, error);
		return null;
	}
}

export function toCollectionEntries(collections: IconifyCollections): CollectionEntry[] {
	return Object.entries(collections).map(([prefix, info]) => ({ prefix, info }));
}

export function filterCollectionEntries(entries: CollectionEntry[], query: string): CollectionEntry[] {
	const lowerCaseQuery = query.trim().toLocaleLowerCase();
	if (lowerCaseQuery === "") return entries;

	return entries.filter(({ prefix, info }) =>
		[info.name, prefix, info.category ?? ""].some((value) =>
			value.toLocaleLowerCase().includes(lowerCaseQuery),
		),
	);
}

async function fetchIconifyCollections(): Promise<IconifyCollections | null> {
	const url = `${C.settings.iconify.apiBaseUrl}/collections`;
	try {
		const response = await requestUrl({ url, throw: false });
		if (response.status !== 200) {
			console.error(`Iconify request to ${url} failed with status ${response.status}`, response.text);
			return null;
		}

		const json: unknown = response.json;
		if (!isIconifyCollections(json)) {
			console.error(`Iconify request to ${url} did not return a valid collection list`, json);
			return null;
		}

		return json;
	} catch (error) {
		console.error(`Iconify request to ${url} threw`, error);
		return null;
	}
}
