import { App } from "obsidian";
import { MarkerEntry, MarkerObject } from "@plugin/types";
import { isArray, isNonEmptyObject } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";

function hasMarkers(value: unknown): value is { marker: MarkerObject[] } {
	if (!isNonEmptyObject(value)) return false;
	if (!("marker" in value)) return false;
	return isArray(value.marker, SchemaValidator.marker);
}

function entryToObject(entry: MarkerEntry): MarkerObject {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name, link, ...markerObject } = entry;
	return markerObject;
}

export class Frontmatter {
	constructor(private app: App) {}

	addMarker(marker: MarkerEntry) {
		this.processFrontMatter(marker, (frontmatter) => {
			if (!isNonEmptyObject(frontmatter)) return;

			if (hasMarkers(frontmatter)) {
				frontmatter.marker.push(entryToObject(marker));
			} else {
				frontmatter.marker = [entryToObject(marker)];
			}
		});
	}

	updateMarker(markerOld: MarkerEntry, markerNew: MarkerEntry) {
		this.processFrontMatter(markerOld, (frontmatter) => {
			if (!hasMarkers(frontmatter)) return;
		});
	}

	removeMarker(marker: MarkerEntry) {
		this.processFrontMatter(marker, (frontmatter) => {
			if (!hasMarkers(frontmatter)) return;
		});
	}

	private processFrontMatter(marker: MarkerEntry, operation: (frontmatter: unknown) => void): void {
		const file = this.app.vault.getFileByPath(marker.link);
		if (!file) throw new Error("File not found");

		void this.app.fileManager.processFrontMatter(file, (frontmatter) => operation(frontmatter));
	}
}
