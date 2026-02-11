import { getIcon } from "obsidian";
import { Coordinates } from "./types";

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function transpose(value: [number, number]): [number, number] {
	return [value[1], value[0]];
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
	return Object.keys.length > 0;
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}
