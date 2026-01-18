import { Value } from "obsidian";
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

export function markersFromEntry(entry: Value | null): Marker[] | null {
	// castEntryToMarker is only safe to use after validation
	function castEntryToMarker(cast: object): Marker {
		if (!("coordinates" in cast)) throw new Error("Cast not properly validated");

		return {
			...cast,
			coordinates: (cast["coordinates"] as string)
				.replace(/\s/g, "")
				.split(",")
				.map((coordinate) => parseInt(coordinate)),
		};
	}

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
	if (!markers.every((marker) => marker && typeof marker === "object")) return null;
	return (markers as object[])
		.map((markerEntry) => {
			// The POJO cast messes with number properties, repair minZoom before validation
			if ("minZoom" in markerEntry) {
				markerEntry.minZoom = parseInt(markerEntry.minZoom as string);
			}
			return validator(markerEntry) ? castEntryToMarker(markerEntry) : null;
		})
		.filter((marker) => marker !== null);
}
