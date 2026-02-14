import { LeafletMouseEvent } from "leaflet";
import { Constants as C } from "plugin/constants";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class MeasureControl extends SubControl {
	override onAdded(): void {
		this.button?.appendChild(getIconWithDefault(C.map.controlIcons.measure));
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		//throw new Error("Not implemented");
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
