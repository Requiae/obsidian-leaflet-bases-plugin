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
	function castEntryToMarker(cast: any): Marker {
		return {
			...cast,
			coordinates: (cast.coordinates as string)
				.replace(/\s/g, "")
				.split(",")
				.map((coordinate) => parseInt(coordinate)),
		};
	}

	if (entry === null) return null;

	// ListValue is not iterable and ObjectValue is burdensome
	// Because working with nested Values is horrible, JSON cast to POJO
	var markerEntries: any;
	try {
		markerEntries = JSON.parse(entry.toString());
	} catch (error) {
		console.log(error);
		return null;
	}

	const markers: any[] = Array.isArray(markerEntries) ? markerEntries : [markerEntries];
	return markers
		.map((markerEntry) => {
			// The POJO cast messes with number properties, repair minZoom before validation
			if (markerEntry.minZoom) {
				markerEntry.minZoom = parseInt(markerEntry.minZoom as string);
			}
			return validator(markerEntry) ? castEntryToMarker(markerEntry) : null;
		})
		.filter((marker) => marker !== null);
}
