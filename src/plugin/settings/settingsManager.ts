import { Constants as C } from "@plugin/constants";
import { BasesLeafletViewSettings, Manager } from "@plugin/types";
import { BasesLeafletViewSettingsTab } from "./basesLeafletViewSettingsTab";

export class SettingsManager extends Manager {
	settings: BasesLeafletViewSettings;

	async load(): Promise<void> {
		await this.loadSettings();

		this.plugin.addSettingTab(new BasesLeafletViewSettingsTab(this.plugin, this));
	}

	unload(): void {}

	async loadSettings(): Promise<void> {
		const defaultData: BasesLeafletViewSettings = { ...C.settings.default, iconData: [] };
		const loadedData = (await this.plugin.loadData()) as BasesLeafletViewSettings;
		this.settings = Object.assign({}, defaultData, loadedData);
	}

	async saveSettings(): Promise<void> {
		await this.plugin.saveData(this.settings);
	}
}
