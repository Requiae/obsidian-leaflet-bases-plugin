import { App } from "obsidian";
import { MarkerEntry, MarkerObject, StringMap } from "@plugin/types";
import { isArray, markerEntryToObject } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";

function hasMarkers(value: unknown): value is { marker: MarkerObject[] } {
	if (!Validator.stringMap(value)) return false;
	if (!("marker" in value)) return false;
	return isArray(value.marker, SchemaValidator.marker);
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

	addMarker(marker: MarkerEntry): void {
		void this.processFrontMatter(marker, (frontmatter: StringMap) => {
			if (hasMarkers(frontmatter)) {
				frontmatter.marker.push(markerEntryToObject(marker));
			} else {
				frontmatter.marker = [markerEntryToObject(marker)];
			}
		});
	}

	updateMarker(markerOld: MarkerEntry, markerNew: MarkerEntry | MarkerObject): void {
		void this.processFrontMatter(markerOld, (frontmatter) => {
			if (!hasMarkers(frontmatter)) throw new Error(`No markers found in ${markerOld.link}`);

			const markerIndex = frontmatter.marker.findIndex((el) => areEqualMarkers(el, markerOld));
			if (markerIndex < 0) throw new Error(`Selected marker not found in ${markerOld.link}`);

			frontmatter.marker.splice(markerIndex, 1, markerEntryToObject(markerNew));
		});
	}

	removeMarker(marker: MarkerEntry): void {
		void this.processFrontMatter(marker, (frontmatter) => {
			if (!hasMarkers(frontmatter)) throw new Error(`No markers found in ${marker.link}`);

			const markerIndex = frontmatter.marker.findIndex((el) => areEqualMarkers(el, marker));
			if (markerIndex < 0) throw new Error(`Selected marker not found in ${marker.link}`);

			frontmatter.marker.splice(markerIndex, 1);
		});
	}

	private async processFrontMatter(
		marker: MarkerEntry,
		operation: (frontmatter: unknown) => void,
	): Promise<void> {
		if (marker.name.length === 0) throw new Error("No file to add marker to");

		let file = marker.link.length > 0 ? this.app.vault.getFileByPath(marker.link) : null;
		if (!file) {
			// TODO: Handle file already exists... Maybe rethink this entire thing
			file = await this.app.vault.create(`${marker.name}.md`, "");
		}

		await this.app.fileManager.processFrontMatter(file, (frontmatter) => operation(frontmatter));
	}
}
