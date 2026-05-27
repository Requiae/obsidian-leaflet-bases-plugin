import { LatLng, LatLngLiteral, LatLngTuple } from "leaflet";
import { getIcon } from "obsidian";
import { Coordinates, StringMap } from "@plugin/types";

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
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

	if (!isLatLngTuple(parsedCoordinates)) {
		throw new Error("Coordinates not properly validated");
	}

	return parsedCoordinates;
}

export function writeCoordinates(coordinates: LatLng): Coordinates {
	return `${Math.round(coordinates.lat)}, ${Math.round(coordinates.lng)}`;
}

export function isLatLngTuple(value: unknown): value is LatLngTuple {
	return (
		!!value &&
		Array.isArray(value) &&
		value.length === 2 &&
		value.every((value) => typeof value === "number" && !isNaN(value))
	);
}

export function isNonEmptyObject(value: unknown): value is StringMap {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	return Object.keys(value).length > 0;
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
