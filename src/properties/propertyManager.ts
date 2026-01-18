import { MetadataTypeManager } from "obsidian-typings";
import { markerProperty } from "./markerProperty";
import { BaseLeafletViewPlugin } from "plugin/plugin";

export class PropertyManager {
	private metadataTypeManager: MetadataTypeManager;

	constructor(public plugin: BaseLeafletViewPlugin) {
		this.metadataTypeManager = plugin.app.metadataTypeManager;

		this.load();
	}

	private load() {
		this.metadataTypeManager.registeredTypeWidgets["marker"] = markerProperty;

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
