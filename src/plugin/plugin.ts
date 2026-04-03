import { App, Plugin, PluginManifest } from "obsidian";
import { ViewManager } from "@plugin/bases/viewManager";
import { PropertyManager } from "@plugin/properties/propertyManager";
import { IconManager } from "./icons/iconManager";

export class BaseLeafletViewPlugin extends Plugin {
	iconManager: IconManager;
	propertyManager: PropertyManager;
	viewManager: ViewManager;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.iconManager = new IconManager(this);
		this.propertyManager = new PropertyManager(this);
		this.viewManager = new ViewManager(this);
	}

	override onunload() {
		this.iconManager?.unload();
		this.propertyManager?.unload();
		this.viewManager?.unload();
	}
}
