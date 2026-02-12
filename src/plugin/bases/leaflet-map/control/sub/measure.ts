import { DomEvent, DomUtil, LeafletMouseEvent } from "leaflet";
import { SubControl } from "../subControl";

export class MeasureControl extends SubControl {
	onAdd(containerEl: HTMLElement): void {
		this.button = DomUtil.create("button", "leaflet-control-button", containerEl);
		this.button.textContent = "Kaas";

		this.button.addEventListener("click", (event) => {
			console.log(event);
		});
		DomEvent.disableClickPropagation(containerEl);
	}

	onRemove(): void {
		this.button?.removeEventListener("click", (_event) => {});
	}

	mapClicked(_event: LeafletMouseEvent): void {
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
