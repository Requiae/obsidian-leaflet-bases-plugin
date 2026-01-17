import { App, PluginSettingTab, Setting } from "obsidian";
import { BaseLeafletViewPlugin } from "plugin/plugin";

export interface BaseLeafletViewPluginSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: BaseLeafletViewPluginSettings = {
	mySetting: "default",
};

export class BaseLeafletViewPluginSettingTab extends PluginSettingTab {
	plugin: BaseLeafletViewPlugin;

	constructor(app: App, plugin: BaseLeafletViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Settings #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
