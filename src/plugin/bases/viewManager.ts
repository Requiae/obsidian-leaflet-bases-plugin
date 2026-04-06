import { Manager } from "@plugin/types";
import { LeafletMapViewRegistrationBuilder } from "./leaflet-map/view";

export class ViewManager extends Manager {
	async load(): Promise<void> {
		this.plugin.registerBasesView(...LeafletMapViewRegistrationBuilder());
	}

	unload(): void {}
}
