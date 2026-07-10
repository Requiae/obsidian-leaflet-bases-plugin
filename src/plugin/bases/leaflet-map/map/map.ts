import { Map as LeafletMap, MapOptions } from "leaflet";
import { Constants as C } from "@plugin/constants";

export function map(element: string | HTMLElement, options?: MapOptions): Map {
	return new Map(element, options);
}

export class Map extends LeafletMap {
	markerDragEnabled: boolean = false;

	refresh(): void {
		this.fireEvent(C.map.events.markerRefresh);
	}
}
