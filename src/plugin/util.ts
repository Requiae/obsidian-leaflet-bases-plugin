import { getIcon } from "obsidian";

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
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
