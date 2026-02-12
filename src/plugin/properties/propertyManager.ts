import { MetadataTypeManager } from "obsidian-typings";
import { Constants as C } from "plugin/constants";
import { BaseLeafletViewPlugin } from "plugin/plugin";
import { markerWidget } from "./components/markerPropertyWidget";

export class PropertyManager {
	private metadataTypeManager: MetadataTypeManager;

	constructor(public plugin: BaseLeafletViewPlugin) {
		this.metadataTypeManager = plugin.app.metadataTypeManager;

		this.metadataTypeManager.registeredTypeWidgets[C.property.marker.identifier] = markerWidget;
	}

	unload() {
		delete this.metadataTypeManager.registeredTypeWidgets[C.property.marker.identifier];
	}
}
