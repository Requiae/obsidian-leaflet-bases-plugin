import { LatLng, LatLngLiteral, LatLngTuple } from "leaflet";
import { getIcon } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { Coordinates, MapObject, MarkerEntry, MarkerObject, RequiredMapObject, StringMap } from "@plugin/types";
import { Validator } from "./validation/validators";

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

// Used to compute required (fully-defaulted) settings for a map view that
// isn't the currently-loaded one, e.g. when reading another .base file's
// raw YAML config to find candidate Leaflet map views to pick from.
export function fillMapDefaults(settings: MapObject): RequiredMapObject {
	const minZoom = settings.minZoom ?? C.map.default.minZoom;
	const maxZoom = Math.max(settings.maxZoom ?? C.map.default.maxZoom, minZoom);

	return {
		...settings,
		height: settings.height ?? C.map.default.height,
		minZoom,
		maxZoom,
		defaultZoom: clamp(settings.defaultZoom ?? minZoom, minZoom, maxZoom),
		zoomDelta: settings.zoomDelta ?? C.map.default.zoomDelta,
		scale: settings.scale ?? C.map.default.scale,
		unit: settings.unit ?? C.map.default.unit,
	};
}

export function distance(a: LatLngLiteral, b: LatLngLiteral): number {
	return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}

export function toOptionalFixed(value: number, digits: number): `${number}` {
	return `${parseFloat(value.toFixed(digits))}`;
}

export function getIconWithDefault(iconId: string | undefined): SVGSVGElement {
	if (iconId) {
		const icon = getIcon(iconId);
		if (icon) return icon;
	}

	const defaultIcon = getIcon("circle-small");
	if (!(defaultIcon instanceof SVGSVGElement)) throw new Error("Faulty default icon set");

	defaultIcon.setAttribute("fill", "currentColor");
	return defaultIcon;
}

export function parseCoordinates(coordinates: Coordinates): LatLngTuple {
	const parsedCoordinates = coordinates
		.replace(/\s/g, "")
		.split(",")
		.map((coordinate) => parseInt(coordinate));

	if (!Validator.latLngTuple(parsedCoordinates)) {
		throw new Error("Coordinates not properly validated");
	}

	return parsedCoordinates;
}

export function writeCoordinates(coordinates: LatLng): Coordinates {
	return `${Math.round(coordinates.lat)}, ${Math.round(coordinates.lng)}`;
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

export function isArray<T>(
	array: unknown,
	validator: (element: unknown) => element is T,
): array is T[] {
	if (!Array.isArray(array)) return false;
	return array.every((element) => validator(element));
}

export function isNonEmptyObject(value: unknown): value is StringMap {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	return Object.keys(value).length > 0;
}

export function markerEntryToObject(entry: MarkerEntry | MarkerObject): MarkerObject {
	return {
		colour: entry.colour,
		coordinates: entry.coordinates,
		icon: entry.icon,
		mapName: entry.mapName,
		minZoom: entry.minZoom,
	};
}
