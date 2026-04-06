import { Plugin } from "obsidian";
import { ViewManager } from "@plugin/bases/viewManager";
import { PropertyManager } from "@plugin/properties/propertyManager";
import { IconManager } from "./icons/iconManager";

export class BasesLeafletViewPlugin extends Plugin {
	iconManager = new IconManager(this);
	propertyManager = new PropertyManager(this);
	viewManager = new ViewManager(this);

	override async onload(): Promise<void> {
		await this.iconManager.load();
		await this.propertyManager.load();
		await this.viewManager.load();
	}

	override onunload() {
		this.iconManager?.unload();
		this.propertyManager?.unload();
		this.viewManager?.unload();
	}
}
