import { BaseLeafletViewPlugin } from "@plugin/plugin";
import { LeafletMapViewRegistrationBuilder } from "./leaflet-map/view";

export class ViewManager {
	constructor(public plugin: BaseLeafletViewPlugin) {
		this.plugin.registerBasesView(...LeafletMapViewRegistrationBuilder());
	}

	unload() {}
}
