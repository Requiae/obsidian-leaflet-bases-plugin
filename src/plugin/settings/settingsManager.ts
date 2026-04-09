import { Constants as C } from "@plugin/constants";
import { BasesLeafletViewSettings, Manager } from "@plugin/types";
import { BasesLeafletViewSettingsTab } from "./basesLeafletViewSettingsTab";

export class SettingsManager extends Manager {
	private _settings: BasesLeafletViewSettings;
	get settings(): BasesLeafletViewSettings {
		return this._settings;
	}

	async load(): Promise<void> {
		await this.loadSettings();

		this.plugin.addSettingTab(new BasesLeafletViewSettingsTab(this.plugin, this));
	}

	unload(): void {}

	async loadSettings(): Promise<void> {
		const defaultData: BasesLeafletViewSettings = { ...C.settings.default, iconData: [] };
		const loadedData = (await this.plugin.loadData()) as BasesLeafletViewSettings;
		this._settings = Object.assign({}, defaultData, loadedData);
	}

	async updateSettings(settings: Partial<BasesLeafletViewSettings>): Promise<void> {
		this._settings = Object.assign(this._settings, settings);
		await this.plugin.saveData(this._settings);
	}
}
