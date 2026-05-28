import { App } from "obsidian";
import { MarkerEntry, MarkerObject } from "@plugin/types";
import { isArray } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";

function hasMarkers(value: unknown): value is { marker: MarkerObject[] } {
	if (!Validator.stringMap(value)) return false;
	if (!("marker" in value)) return false;
	return isArray(value.marker, SchemaValidator.marker);
}

function entryToObject(entry: MarkerEntry): MarkerObject {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name, link, ...markerObject } = entry;
	return markerObject;
}

function areEqualMarkers(marker1: MarkerObject, marker2: MarkerObject): boolean {
	return (
		marker1.colour === marker2.colour &&
		marker1.coordinates === marker2.coordinates &&
		marker1.icon === marker2.icon &&
		marker1.mapName === marker2.mapName &&
		marker1.minZoom === marker2.minZoom
	);
}

export class Frontmatter {
	constructor(private app: App) {}

	addMarker(marker: MarkerEntry) {
		this.processFrontMatter(marker, (frontmatter) => {
			if (!Validator.stringMap(frontmatter)) return;

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

			const markerIndex = frontmatter.marker.findIndex((el) => areEqualMarkers(el, markerOld));
			if (markerIndex < 0) return;

			frontmatter.marker.splice(markerIndex, 1, entryToObject(markerNew));
		});
	}

	removeMarker(marker: MarkerEntry) {
		this.processFrontMatter(marker, (frontmatter) => {
			if (!hasMarkers(frontmatter)) return;

			const markerIndex = frontmatter.marker.findIndex((el) => areEqualMarkers(el, marker));
			if (markerIndex < 0) return;

			frontmatter.marker.splice(markerIndex, 1);
		});
	}

	private processFrontMatter(marker: MarkerEntry, operation: (frontmatter: unknown) => void): void {
		const file = this.app.vault.getFileByPath(marker.link);
		if (!file) throw new Error("File not found");

		void this.app.fileManager.processFrontMatter(file, (frontmatter) => operation(frontmatter));
	}
}
