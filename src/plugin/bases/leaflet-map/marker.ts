import { App, BasesEntry, TFile, Value } from "obsidian";
import {
	divIcon,
	DivIcon,
	LayerGroup,
	LeafletMouseEvent,
	LeafletMouseEventHandlerFn,
	Map,
	marker,
	Marker,
} from "leaflet";
import { markerColourMap, regExpMap } from "plugin/constants";
import { schemaValidatorFactory } from "properties/schemas";
import { ValidatorFunction } from "properties/validators";
import { MarkerObject } from "plugin/types";
import { getIconWithDefault } from "plugin/util";

interface MarkerEntry extends MarkerObject {
	name: string;
	link: string;
}

const validator: ValidatorFunction = schemaValidatorFactory("marker");

function isProperEntry(entry: unknown): entry is { [key: string]: string } {
	if (!entry || typeof entry !== "object") return false;
	return Object.values(entry).every((property) => typeof property === "string");
}

function parseCoordinates(coordinates: string): [number, number] {
	const parsedCoordinates = coordinates
		.replace(/\s/g, "")
		.split(",")
		.map((coordinate) => parseInt(coordinate));
	if (parsedCoordinates.length !== 2) throw new Error("Coordinates not properly validated");
	return parsedCoordinates as [number, number];
}

function parseColour(colour: string): string {
	const inputValue = colour.toLowerCase();
	return Object.keys(markerColourMap).includes(inputValue)
		? markerColourMap[inputValue as keyof typeof markerColourMap]
		: inputValue;
}

function parseMarkerFromEntry(entry: unknown, name: string, link: string): MarkerEntry | null {
	if (!isProperEntry(entry)) return null;

	// The POJO cast messes with number properties, repair minZoom before validation
	const minZoom = "minZoom" in entry ? parseFloat(entry.minZoom) : undefined;
	if (!validator({ ...entry, minZoom })) return null;

	if (!("coordinates" in entry)) throw new Error("Marker not properly validated");

	return {
		mapName: entry.mapName,
		name,
		link,
		coordinates: parseCoordinates(entry.coordinates),
		icon: entry.icon,
		colour: "colour" in entry ? parseColour(entry.colour) : undefined,
		minZoom,
	};
}

function markersFromEntry(entry: Value | null, file: TFile): MarkerEntry[] | null {
	if (entry === null) return null;

	// ListValue is not iterable and ObjectValue is burdensome
	// Because working with nested Values is horrible, JSON cast to POJO
	// Value converted to string is CSV, even when array, make into a proper array
	let entryString = entry.toString();
	if (!regExpMap.arrayString.test(entryString)) entryString = `[${entryString}]`;

	let markerEntries: unknown;
	try {
		markerEntries = JSON.parse(entryString);
	} catch {
		return null;
	}

	if (!Array.isArray(markerEntries)) return null;
	return markerEntries
		.map((markerEntry) => parseMarkerFromEntry(markerEntry, file.name, file.path))
		.filter((marker) => marker !== null);
}

export class MarkerManager {
	private xmlSerializer: XMLSerializer;

	private mapName: string | undefined = undefined;
	private map: Map;
	private markerLayer: LayerGroup;
	private mapMinZoom: number = 0;

	constructor(public app: App) {
		this.xmlSerializer = new XMLSerializer();
	}

	unload(): void {
		this.markerLayer?.clearLayers();
	}

	addMarkerWhenZoom(markerItem: Marker, markerZoom: number) {
		const tolerance = 0.00001; // We have to deal with floating point errors
		if (this.map.getZoom() >= markerZoom - tolerance) {
			markerItem.addTo(this.markerLayer);
		} else {
			markerItem.remove();
		}
	}

	updateMarkers(data: { data: BasesEntry[] }): void {
		if (!this.markerLayer) throw new Error("MarkerLayer not initialised");
		this.markerLayer.clearLayers();

		data.data
			.flatMap((entry) => markersFromEntry(entry.getValue("note.marker"), entry.file))
			.filter((markerEntry) => markerEntry !== null)
			.filter(
				(markerEntry) => markerEntry.mapName === undefined || markerEntry.mapName === this.mapName,
			)
			.forEach((markerEntry) => {
				const options = { icon: this.buildMarkerIcon(markerEntry.icon, markerEntry.colour) };
				// LatLng is y, x so we reverse the coordinates
				const markerItem = marker([markerEntry.coordinates[1], markerEntry.coordinates[0]], options)
					.bindTooltip(markerEntry.name)
					.on("click", this.getMarkerOnClick(markerEntry.link));

				this.addMarkerWhenZoom(markerItem, markerEntry.minZoom ?? this.mapMinZoom);
				this.map.on("zoomend", () =>
					this.addMarkerWhenZoom(markerItem, markerEntry.minZoom ?? this.mapMinZoom),
				);
			});
	}

	setMap(map: Map) {
		this.map = map;
	}

	setMapName(mapName: string | undefined) {
		this.mapName = mapName;
	}

	setMarkerLayer(markerLayer: LayerGroup, mapMinZoom: number) {
		this.markerLayer?.clearLayers();
		this.markerLayer = markerLayer;
		this.mapMinZoom = mapMinZoom;
	}

	private buildMarkerIcon(iconId: string | undefined, colour: string | undefined): DivIcon {
		const innerIcon = getIconWithDefault(iconId);
		innerIcon.addClass("leaflet-marker-inner-icon");

		return divIcon({
			className: "leaflet-marker-icon",
			html: `
				<svg class="leaflet-marker-pin" style="fill:${colour ?? markerColourMap.blue}" viewBox="0 0 32 48">
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
