import { BasesViewRegistration } from "obsidian";
import { BaseLeafletViewPlugin } from "plugin/plugin";
import { LeafletMapViewRegistrationBuilder } from "./leaflet-map/view";

type ViewRegistration = [string, BasesViewRegistration];
export type ViewRegistrationBuilder = () => ViewRegistration;

export class ViewManager {
	constructor(public plugin: BaseLeafletViewPlugin) {
		this.plugin.registerBasesView(...LeafletMapViewRegistrationBuilder());
	}

	unload() {}
}
