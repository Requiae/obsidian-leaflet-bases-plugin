import { LatLngLiteral } from "leaflet";
import { getIcon } from "obsidian";
import { Coordinates } from "@plugin/types";

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function distance(a: LatLngLiteral, b: LatLngLiteral): number {
	return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
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

export function parseCoordinates(coordinates: Coordinates): [number, number] {
	const parsedCoordinates = coordinates
		.replace(/\s/g, "")
		.split(",")
		.map((coordinate) => parseInt(coordinate));
	if (parsedCoordinates.length !== 2) throw new Error("Coordinates not properly validated");
	return parsedCoordinates as [number, number];
}

export function isNonEmptyObject(value: unknown): value is { [key: string]: unknown } {
	if (!value || typeof value !== "object") return false;
	return Object.keys(value).length > 0;
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}
