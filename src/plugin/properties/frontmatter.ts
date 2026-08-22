import { App, TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { SettingsManager } from "@plugin/settings/settingsManager";
import { MarkerEntry, MarkerObject, StringMap } from "@plugin/types";
import { isArray, markerEntryToObject } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";

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
	constructor(
		private app: App,
		private settingsManager: SettingsManager,
	) {}

	/** If the default property id is not used, then there's no way to realistically determine which property id holds the expected values, so we just return the first that holds markers. */
	private findFirstMarkerPropertyId(map: StringMap): string | null {
		const defaultProperty = this.settingsManager.settings.defaultMarkerPropertyId;
		if (defaultProperty in map && isArray(map[defaultProperty], SchemaValidator.marker)) {
			return defaultProperty;
		}

		// Default key doesn't hold markers
		for (const [key, value] of Object.entries(map)) {
			if (isArray(value, SchemaValidator.marker)) return key;
		}

		// No alternatives found
		return null;
	}

	addMarkerToFile(file: TFile, marker: MarkerObject): void {
		void this.app.fileManager.processFrontMatter(file, (frontmatter) =>
			this.appendMarker(frontmatter, marker),
		);
	}

	private appendMarker(frontmatter: unknown, marker: MarkerObject): void {
		if (!Validator.stringMap(frontmatter)) throw new Error(`Frontmatter is not of type StringMap`);

		const firstMarkerPropertyId = this.findFirstMarkerPropertyId(frontmatter);
		if (firstMarkerPropertyId) {
			(frontmatter[firstMarkerPropertyId] as MarkerObject[]).push(marker);
		} else {
			frontmatter[C.property.marker.default] = [marker];
		}
	}

	updateMarker(markerOld: MarkerEntry, markerNew: MarkerEntry | MarkerObject): void {
		void this.processFrontMatter(markerOld, (frontmatter) => {
			if (!Validator.stringMap(frontmatter)) {
				throw new Error(`Frontmatter is not of type StringMap`);
			}

			const firstMarkerPropertyId = this.findFirstMarkerPropertyId(frontmatter);
			if (!firstMarkerPropertyId) throw new Error(`No markers found in ${markerOld.link}`);

			const markerIndex = (frontmatter[firstMarkerPropertyId] as MarkerObject[]).findIndex((el) =>
				areEqualMarkers(el, markerOld),
			);
			if (markerIndex < 0) throw new Error(`Selected marker not found in ${markerOld.link}`);

			(frontmatter[firstMarkerPropertyId] as MarkerObject[]).splice(
				markerIndex,
				1,
				markerEntryToObject(markerNew),
			);
		});
	}

	removeMarker(marker: MarkerEntry): void {
		void this.processFrontMatter(marker, (frontmatter) => {
			if (!Validator.stringMap(frontmatter)) {
				throw new Error(`Frontmatter is not of type StringMap`);
			}

			const firstMarkerPropertyId = this.findFirstMarkerPropertyId(frontmatter);
			if (!firstMarkerPropertyId) throw new Error(`No markers found in ${marker.link}`);

			const markerIndex = (frontmatter[firstMarkerPropertyId] as MarkerObject[]).findIndex((el) =>
				areEqualMarkers(el, marker),
			);
			if (markerIndex < 0) throw new Error(`Selected marker not found in ${marker.link}`);

			(frontmatter[firstMarkerPropertyId] as MarkerObject[]).splice(markerIndex, 1);
		});
	}

	private async processFrontMatter(
		marker: MarkerEntry,
		operation: (frontmatter: unknown) => void,
	): Promise<void> {
		if (marker.name.length === 0) throw new Error("No file to add marker to");

		let file = marker.link.length > 0 ? this.app.vault.getFileByPath(marker.link) : null;
		if (!file) {
			throw new Error("No file found");
		}

		await this.app.fileManager.processFrontMatter(file, (frontmatter) => operation(frontmatter));
	}
}
