import { BaseLeafletViewPlugin } from "plugin/plugin";
import { LeafletMapViewRegistrationBuilder } from "./leaflet-map/view";
import { BasesViewRegistration } from "obsidian";

export type ViewRegistration = [string, BasesViewRegistration];
export type ViewRegistrationBuilder = (plugin: BaseLeafletViewPlugin) => ViewRegistration;

export class ViewManager {
	constructor(public plugin: BaseLeafletViewPlugin) {
		this.load();
	}

	private load() {
		this.plugin.registerBasesView(...LeafletMapViewRegistrationBuilder(this.plugin));
	}

	unload() {}
}
