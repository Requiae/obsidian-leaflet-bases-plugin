import { MetadataTypeManager } from "obsidian-typings";
import { Constants as C } from "@plugin/constants";
import { Manager } from "@plugin/types";
import { markerWidget } from "./components/markerPropertyWidget";

export class PropertyManager extends Manager {
	private metadataTypeManager: MetadataTypeManager | null;

	async load(): Promise<void> {
		this.metadataTypeManager = this.plugin.app.metadataTypeManager;
		this.metadataTypeManager.registeredTypeWidgets[C.property.marker.identifier] = markerWidget;
	}

	unload(): void {
		delete this.metadataTypeManager?.registeredTypeWidgets[C.property.marker.identifier];
		this.metadataTypeManager = null;
	}
}
