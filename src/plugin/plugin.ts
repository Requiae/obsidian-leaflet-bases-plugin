import { App, Plugin, PluginManifest } from "obsidian";
import { ViewManager } from "plugin/bases/viewManager";
import { PropertyManager } from "plugin/properties/propertyManager";

export class BaseLeafletViewPlugin extends Plugin {
	propertyManager: PropertyManager;
	viewManager: ViewManager;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.propertyManager = new PropertyManager(this);
		this.viewManager = new ViewManager(this);
	}

	override onunload() {
		this.propertyManager?.unload();
		this.viewManager?.unload();
	}
}
