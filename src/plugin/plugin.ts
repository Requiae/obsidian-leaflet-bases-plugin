import { Notice, Plugin, TAbstractFile } from "obsidian";
import {
	DEFAULT_SETTINGS,
	BaseLeafletViewPluginSettings,
	BaseLeafletViewPluginSettingTab,
} from "plugin/settings";
import { RasteriseModal } from "plugin/modal";
import { PropertyManager } from "properties/propertyManager";
import { ViewManager } from "plugin/bases/viewManager";

export class BaseLeafletViewPlugin extends Plugin {
	settings: BaseLeafletViewPluginSettings;
	propertyManager: PropertyManager;
	viewManager: ViewManager;

	async onload() {
		await this.loadSettings();
		this.propertyManager = new PropertyManager(this);
		this.viewManager = new ViewManager(this);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
						.setTitle("Print file path 👈")
						.setIcon("document")
						.onClick(async () => this.rasteriseImage(file));
				});
			}),
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BaseLeafletViewPluginSettingTab(this.app, this));
	}

	onunload() {
		this.propertyManager.unload();
		this.viewManager.unload();
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

	async rasteriseImage(file: TAbstractFile) {
		new Notice(file.path);

		new RasteriseModal(this.app, (result) => {
			new Notice(`Hello, ${result}!`);
		}).open();
	}
}
