import { PluginSettingTab, SettingGroup } from "obsidian";
import { t } from "@plugin/i18n/locale";
import BasesLeafletViewPlugin from "../../main";
import { SettingsManager } from "./settingsManager";

export class BasesLeafletViewSettingsTab extends PluginSettingTab {
	constructor(
		plugin: BasesLeafletViewPlugin,
		private manager: SettingsManager,
	) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	override display(): void {
		let { containerEl } = this;

		containerEl.empty();

		const toolGroup = new SettingGroup(containerEl).setHeading(t("settings.tools.title"));
		toolGroup.addSetting((setting) => {
			setting
				.setName(t("settings.tools.measure.title"))
				.setDesc(t("settings.tools.measure.description"))
				.addToggle((toggle) =>
					toggle.setValue(this.manager.settings.enableMeasureTool).onChange(async (value) => {
						this.manager.settings.enableMeasureTool = value;
						await this.manager.saveSettings();
					}),
				);
		});
		toolGroup.addSetting((setting) => {
			setting
				.setName(t("settings.tools.copy.title"))
				.setDesc(t("settings.tools.copy.description"))
				.addToggle((toggle) =>
					toggle.setValue(this.manager.settings.enableCopyTool).onChange(async (value) => {
						this.manager.settings.enableCopyTool = value;
						await this.manager.saveSettings();
					}),
				);
		});
	}
}
