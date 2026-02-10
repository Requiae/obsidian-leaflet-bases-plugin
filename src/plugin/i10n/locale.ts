import { getLanguage } from "obsidian";

import en from "./locales/en";
import { isNonEmptyObject } from "plugin/util";

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
};

const userLocale = { ...en, ...localeMap[getLanguage() || "en"] };

type KeyPath<T extends string, K extends string> = `${T}${"" extends T ? "" : "."}${K}`;
type KeyPaths<T extends object, P extends string = ""> = {
	[K in keyof T]-?: K extends string
		? NonNullable<T[K]> extends object
			? // There's a nested object, so we must explore it
					KeyPath<P, K> | KeyPaths<NonNullable<T[K]>, KeyPath<P, K>>
			: // No nested object, we only return the current key
				KeyPath<P, K>
		: // Key is not a string so we can't really build a key path with it
			never;
}[keyof T & string]; // Extract all values in the new object

function isKeyOf<T extends object>(object: T, key: string | number | symbol): key is keyof T {
	return key in object;
}

export function t(path: KeyPaths<typeof en>): string {
	const keys = path.split(".");

	let currentObj: { [k: string]: unknown } = userLocale;

	for (const key of keys) {
		const value = isKeyOf(currentObj, key) ? currentObj[key] : undefined;

		if (isNonEmptyObject(value)) {
			currentObj = value;
		} else if (typeof value === "string") {
			return value;
		} else {
			return path;
		}
	}
	return path;
}
