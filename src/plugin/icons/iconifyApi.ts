import { requestUrl } from "obsidian";
import { IconifyInfo } from "@iconify/types";
import { Constants as C } from "@plugin/constants";
import { isNonEmptyObject } from "@plugin/util";

export type IconifyCollections = Record<string, IconifyInfo>;

export interface CollectionEntry {
	prefix: string;
	info: IconifyInfo;
}

let collectionsCache: Promise<IconifyCollections | null> | null = null;

export function getIconifyCollections(): Promise<IconifyCollections | null> {
	collectionsCache ??= fetchIconifyCollections();
	return collectionsCache;
}

export async function getIconifyIconSet(prefix: string): Promise<unknown> {
	try {
		const response = await requestUrl({
			url: `${C.settings.iconify.apiBaseUrl}/${prefix}.json`,
			throw: false,
		});
		if (response.status !== 200) return null;

		const json: unknown = response.json;
		return isNonEmptyObject(json) ? json : null;
	} catch (error) {
		console.error(error);
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
	try {
		const response = await requestUrl({
			url: `${C.settings.iconify.apiBaseUrl}/collections`,
			throw: false,
		});
		if (response.status !== 200) return null;

		const json: unknown = response.json;
		return isNonEmptyObject(json) ? (json as IconifyCollections) : null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
