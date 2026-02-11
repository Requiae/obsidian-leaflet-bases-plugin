import {
	DivIcon,
	LayerGroup,
	LeafletMouseEvent,
	LeafletMouseEventHandlerFn,
	Map,
	Marker,
	divIcon,
	marker,
} from "leaflet";
import { App, BasesEntry, IconName, TFile, Value } from "obsidian";
import { Constants as C } from "plugin/constants";
import { SchemaValidator } from "plugin/properties/schemas";
import { MarkerObject } from "plugin/types";
import { getIconWithDefault, isNonEmptyObject, isNotNull, parseCoordinates } from "plugin/util";

interface MarkerEntry extends MarkerObject {
	name: string;
	link: string;
}

function isProperEntry(entry: unknown): entry is { [key: string]: string } {
	if (!isNonEmptyObject(entry)) return false;
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
	private xmlSerializer: XMLSerializer;

	private mapName: string | undefined;
	private map: Map | undefined;
	private markerLayer: LayerGroup | undefined;
	private mapMinZoom: number = 0;

	constructor(public app: App) {
		this.xmlSerializer = new XMLSerializer();
	}

	unload(): void {
		this.map?.clearAllEventListeners();
		this.markerLayer?.clearLayers();
	}

	private addMarkerWhenZoom(markerItem: Marker, markerZoom: number) {
		if (!this.map || !this.markerLayer) throw new Error("Map not properly initialised");

		const tolerance = 0.00001; // We have to deal with floating point errors
		if (this.map.getZoom() >= markerZoom - tolerance) {
			markerItem.addTo(this.markerLayer);
		} else {
			markerItem.remove();
		}
	}

	updateMarkers(data: { data: BasesEntry[] }): void {
		this.markerLayer?.clearLayers();

		data.data
			.flatMap((entry) => markersFromEntry(entry.getValue("note.marker"), entry.file))
			.filter(isNotNull)
			.filter(
				(markerEntry) => markerEntry.mapName === undefined || markerEntry.mapName === this.mapName,
			)
			.forEach((markerEntry) => {
				const options = { icon: this.buildMarkerIcon(markerEntry.icon, markerEntry.colour) };
				// LatLng is y, x so we reverse the coordinates
				const parsedCoordinates = parseCoordinates(markerEntry.coordinates);
				const markerItem = marker([parsedCoordinates[1], parsedCoordinates[0]], options)
					.bindTooltip(markerEntry.name)
					.on("click", this.getMarkerOnClick(markerEntry.link));

				this.addMarkerWhenZoom(markerItem, markerEntry.minZoom ?? this.mapMinZoom);
				this.map?.on("zoomend", () =>
					this.addMarkerWhenZoom(markerItem, markerEntry.minZoom ?? this.mapMinZoom),
				);
			});
	}

	setMap(map: Map, markerLayer: LayerGroup, mapMinZoom: number) {
		this.map = map;
		this.markerLayer?.clearLayers();
		this.markerLayer = markerLayer;
		this.mapMinZoom = mapMinZoom;
	}

	setMapName(mapName: string | undefined) {
		this.mapName = mapName;
	}

	private buildMarkerIcon(iconId: IconName | undefined, colour: string | undefined): DivIcon {
		const innerIcon = getIconWithDefault(iconId);
		innerIcon.addClass("leaflet-marker-inner-icon");

		return divIcon({
			className: "leaflet-marker-icon",
			html: `
				<svg class="leaflet-marker-pin" style="fill:${colour ?? C.marker.defaultColour}" viewBox="0 0 32 48">
					<path d="m32,19c0,12 -12,24 -16,29c-4,-5 -16,-16 -16,-29a16,19 0 0 1 32,0"/>
				</svg>
				${this.xmlSerializer.serializeToString(innerIcon)}
			`,
			iconSize: [32, 48],
			iconAnchor: [16, 48],
			tooltipAnchor: [17, -30],
		});
	}

	private getMarkerOnClick(url: string): LeafletMouseEventHandlerFn {
		return (_event: LeafletMouseEvent) => {
			void this.app.workspace.openLinkText("", url);
		};
	}
}
