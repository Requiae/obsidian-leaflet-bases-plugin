import { LayerGroup, Map } from "leaflet";
import { App, BasesEntry, TFile, Value } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { MarkerEntry } from "@plugin/types";
import { isNotNull } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";
import { marker, Marker } from "./marker";

function isProperEntry(entry: unknown): entry is { [key: string]: string } {
	if (!Validator.stringMap(entry)) return false;
	return Object.values(entry).every((property) => typeof property === "string");
}

function parseMarkerFromEntry(entry: unknown, name: string, link: string): MarkerEntry | null {
	if (!isProperEntry(entry)) return null;

	// The POJO cast messes with number properties, repair minZoom before validation
	const fixedPOJO = {
		...entry,
		minZoom: "minZoom" in entry ? parseFloat(entry.minZoom) : undefined,
	};
	if (!SchemaValidator.marker(fixedPOJO)) return null;

	return {
		...fixedPOJO,
		name,
		link,
	};
}

function markersFromEntry(entry: Value | null, file: TFile): MarkerEntry[] | null {
	if (entry === null) return null;

	// ListValue is not iterable and ObjectValue is burdensome
	// Because working with nested Values is horrible, JSON cast to POJO
	// Value converted to string is CSV, even when array, make into a proper array
	let entryString = entry.toString();
	if (!C.regExp.arrayString.test(entryString)) entryString = `[${entryString}]`;

	let markerEntries: unknown;
	try {
		markerEntries = JSON.parse(entryString);
	} catch {
		return null;
	}

	if (!Array.isArray(markerEntries)) return null;
	return markerEntries
		.map((markerEntry) => parseMarkerFromEntry(markerEntry, file.basename, file.path))
		.filter(isNotNull);
}

export class MarkerManager {
	private mapName: string | undefined;
	private mapMinZoom: number = 0;

	constructor(
		private app: App,
		private map: Map,
		private markerLayer: LayerGroup,
	) {}

	unload(): void {
		this.markerLayer.clearLayers();
	}

	private addMarkerWhenZoom(markerItem: Marker, markerEntry: MarkerEntry) {
		const tolerance = 0.00001; // We have to deal with floating point errors
		if (this.map.getZoom() >= (markerEntry.minZoom ?? this.mapMinZoom) - tolerance) {
			markerItem.addTo(this.markerLayer);
		} else {
			markerItem.remove();
		}
	}

	updateMarkers(data: { data: BasesEntry[] }): void {
		this.markerLayer.clearLayers();

		data.data
			.flatMap((entry) => markersFromEntry(entry.getValue("note.marker"), entry.file))
			.filter(isNotNull)
			.filter(
				(markerEntry) => markerEntry.mapName === undefined || markerEntry.mapName === this.mapName,
			)
			.forEach((markerEntry) => {
				const markerItem = marker(this.app, this.map, markerEntry);

				this.addMarkerWhenZoom(markerItem, markerEntry);
				this.map.on("zoomend", () => this.addMarkerWhenZoom(markerItem, markerEntry));
			});
	}

	updateSettings(mapName: string | undefined, mapMinZoom: number) {
		this.mapName = mapName;
		this.mapMinZoom = mapMinZoom;
	}
}
