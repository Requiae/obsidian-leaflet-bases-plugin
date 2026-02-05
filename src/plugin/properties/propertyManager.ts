import { MetadataTypeManager } from "obsidian-typings";
import { BaseLeafletViewPlugin } from "plugin/plugin";
import { markerWidget } from "./components/markerPropertyWidget";

export class PropertyManager {
	private metadataTypeManager: MetadataTypeManager;

	constructor(public plugin: BaseLeafletViewPlugin) {
		this.metadataTypeManager = plugin.app.metadataTypeManager;

		this.load();
	}

	private load() {
		this.metadataTypeManager.registeredTypeWidgets["marker"] = markerWidget;

		this.plugin.registerEvent(
			this.metadataTypeManager.on("changed", (property) => {
				// console.log(property);
			}),
		);
	}

	unload() {
		delete this.metadataTypeManager.registeredTypeWidgets["marker"];
	}
}
