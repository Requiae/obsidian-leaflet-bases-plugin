import { Plugin } from "obsidian";
import { ViewManager } from "@plugin/bases/viewManager";
import { PropertyManager } from "@plugin/properties/propertyManager";
import { IconManager } from "./icons/iconManager";
import { SettingsManager } from "./settings/settingsManager";

export class BasesLeafletViewPlugin extends Plugin {
	iconManager = new IconManager(this);
	propertyManager = new PropertyManager(this);
	viewManager = new ViewManager(this);
	settingsManager = new SettingsManager(this);

	override async onload(): Promise<void> {
		await this.iconManager.load();
		await this.propertyManager.load();
		await this.viewManager.load();
		await this.settingsManager.load();
	}

	override onunload() {
		this.iconManager.unload();
		this.propertyManager.unload();
		this.viewManager.unload();
		this.settingsManager.unload();
	}
}
