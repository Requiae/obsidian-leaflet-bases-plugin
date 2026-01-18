import { BasesEntry } from "obsidian";
import { Marker, markersFromEntry } from "./marker";

export class MarkerManager {
	private markers: Marker[] = [];

	constructor() {
		this.load();
	}

	private load() {}

	unload() {}

	getMarkers(): Marker[] {
		return this.markers;
	}

	updateMarkers(data: { data: BasesEntry[] }): void {
		this.markers = data.data
			.flatMap((entry) => markersFromEntry(entry.getValue("note.marker")))
			.filter((marker) => marker !== null);
		// console.log(this.markers);
	}
}
