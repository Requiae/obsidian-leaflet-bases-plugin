import { PluginSettingTab, SettingGroup } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
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
		this.containerEl.empty();

		new SettingGroup(this.containerEl)
			.setHeading(t("settings.tools.title"))
			.addSetting((setting) => {
				setting
					.setName(t("settings.tools.measure.title"))
					.setDesc(t("settings.tools.measure.description"))
					.addToggle((toggle) =>
						toggle.setValue(this.manager.settings.enableMeasureTool).onChange(async (value) => {
							this.manager.settings.enableMeasureTool = value;
							await this.manager.saveSettings();
						}),
					);
			})
			.addSetting((setting) => {
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

		new SettingGroup(this.containerEl).setHeading("Additional icon sets").addSetting((setting) => {
			const fragment = new DocumentFragment();
			fragment.createSpan({ text: "" }, (span) => {
				span.append(`${t("settings.icons.add.description.start")} `);
				span.createEl("a", {
					text: t("settings.icons.add.description.previewLink"),
					href: C.settings.links.preview,
				});
				span.append(` ${t("settings.icons.add.description.middle")} `);
				span.createEl("a", {
					text: t("settings.icons.add.description.githubLink"),
					href: C.settings.links.github,
				});
				span.append(` ${t("settings.icons.add.description.end")}`);
				span.createEl("br");
				span.createEl("br");
				span.createEl("i", { text: t("settings.icons.add.description.warning") });
			});
			setting
				.setName("Add iconify icon set")
				.setDesc(fragment)
				.addButton((button) =>
					button.setButtonText("Add iconset").onClick((event) => {
						console.log(event);
					}),
				);
		});
	}
}
