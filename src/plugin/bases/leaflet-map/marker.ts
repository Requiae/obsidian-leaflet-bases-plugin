import { Value } from "obsidian";
import { markerColourMap } from "plugin/constants";
import { schemaValidatorFactory } from "properties/schemas";
import { ValidatorFunction } from "properties/validators";

export interface Marker {
	mapName?: string;
	coordinates: number[];
	icon?: string;
	colour?: string;
	minZoom?: number;
}

const validator: ValidatorFunction = schemaValidatorFactory("marker");

function isProperEntry(entry: unknown): entry is { [key: string]: string } {
	if (!entry || typeof entry !== "object") return false;
	return Object.values(entry).every((property) => typeof property === "string");
}

function parseCoordinates(coordinates: string): number[] {
	return coordinates
		.replace(/\s/g, "")
		.split(",")
		.map((coordinate) => parseInt(coordinate));
}

function parseColour(colour: string): string {
	const inputValue = colour.toLowerCase();
	return Object.keys(markerColourMap).includes(inputValue)
		? markerColourMap[inputValue as keyof typeof markerColourMap]
		: inputValue;
}

function parseMarkerFromEntry(entry: unknown): Marker | null {
	if (!isProperEntry(entry)) return null;

	// The POJO cast messes with number properties, repair minZoom before validation
	const minZoom = "minZoom" in entry ? parseFloat(entry.minZoom) : undefined;
	if (!validator({ ...entry, minZoom })) return null;

	if (!("coordinates" in entry)) throw new Error("Marker not properly validated");

	return {
		mapName: entry.mapName,
		coordinates: parseCoordinates(entry.coordinates),
		icon: entry.icon,
		colour: "colour" in entry ? parseColour(entry.colour) : undefined,
		minZoom,
	};
}

export function markersFromEntry(entry: Value | null): Marker[] | null {
	if (entry === null) return null;

	// ListValue is not iterable and ObjectValue is burdensome
	// Because working with nested Values is horrible, JSON cast to POJO
	let markerEntries: unknown;
	try {
		markerEntries = JSON.parse(entry.toString());
	} catch {
		return null;
	}

	const markers: unknown[] = Array.isArray(markerEntries) ? markerEntries : [markerEntries];
	return markers
		.map((markerEntry) => parseMarkerFromEntry(markerEntry))
		.filter((marker) => marker !== null);
}
