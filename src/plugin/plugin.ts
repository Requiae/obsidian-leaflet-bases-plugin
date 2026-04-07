import { Plugin } from "obsidian";
import { ViewManager } from "@plugin/bases/viewManager";
import { PropertyManager } from "@plugin/properties/propertyManager";
import { IconManager } from "./icons/iconManager";
import { SettingsManager } from "./settings/settingsManager";

export class BasesLeafletViewPlugin extends Plugin {
	iconManager = new IconManager(this);
	propertyManager = new PropertyManager(this);
	viewManager = new ViewManager(this);

	/* Ensure that this is loaded first and unloaded last as other managers might depend on it */
	settingsManager = new SettingsManager(this);

	override async onload(): Promise<void> {
		await this.settingsManager.load();

		await this.iconManager.load();
		await this.propertyManager.load();
		await this.viewManager.load();
	}

	override onunload() {
		this.iconManager.unload();
		this.propertyManager.unload();
		this.viewManager.unload();

		this.settingsManager.unload();
	}
}
