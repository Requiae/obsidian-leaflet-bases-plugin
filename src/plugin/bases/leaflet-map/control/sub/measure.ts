import { LeafletMouseEvent } from "leaflet";
import { SubControl } from "../subControl";

export class MeasureControl extends SubControl {
	override onAdded(): void {
		// this.button?.textContent = "Kaas";
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}

	/* Drawing measure lines
	polyLine = new Polyline([
		[100, 100],
		[100, 200],
		[200, 200],
	]).addTo(this.leafletMap);
    */
	//polyLine.remove();
}
