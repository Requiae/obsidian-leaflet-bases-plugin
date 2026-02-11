import { App, Plugin, PluginManifest } from "obsidian";
import { ViewManager } from "plugin/bases/viewManager";
import { PropertyManager } from "plugin/properties/propertyManager";
import {
	BaseLeafletViewPluginSettingTab,
	BaseLeafletViewPluginSettings,
	DEFAULT_SETTINGS,
} from "plugin/settings";

export class BaseLeafletViewPlugin extends Plugin {
	settings: BaseLeafletViewPluginSettings = DEFAULT_SETTINGS;
	propertyManager: PropertyManager;
	viewManager: ViewManager;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.propertyManager = new PropertyManager(this);
		this.viewManager = new ViewManager(this);
	}

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BaseLeafletViewPluginSettingTab(this.app, this));
	}

	onunload() {
		this.propertyManager?.unload();
		this.viewManager?.unload();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<BaseLeafletViewPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
