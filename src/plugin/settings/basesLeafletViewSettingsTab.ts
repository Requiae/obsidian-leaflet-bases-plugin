import { Notice, PluginSettingTab, SettingGroup } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import { IconifyJSONIconsObject } from "@plugin/types";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { SettingsManager } from "./settingsManager";

export class BasesLeafletViewSettingsTab extends PluginSettingTab {
	constructor(
		public override plugin: BasesLeafletViewPlugin,
		private manager: SettingsManager,
	) {
		super(plugin.app, plugin);
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
							await this.manager.updateSettings({ enableMeasureTool: value });
						}),
					);
			})
			.addSetting((setting) => {
				setting
					.setName(t("settings.tools.copy.title"))
					.setDesc(t("settings.tools.copy.description"))
					.addToggle((toggle) =>
						toggle.setValue(this.manager.settings.enableCopyTool).onChange(async (value) => {
							await this.manager.updateSettings({ enableCopyTool: value });
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
				.addButton(async (button) => {
					const input = button.buttonEl.createEl("input", {
						type: "file",
						attr: { accept: ".json", style: "display: none;" },
					});
					input.onchange = async () => {
						if (!input.files?.length) return;

						try {
							const data: IconifyJSONIconsObject[] = this.manager.settings.iconData;
							for (let file of Array.from(input.files)) {
								const json: unknown = JSON.parse(await file.text());
								if (SchemaValidator.icon(json)) data.push(json);
							}
							await this.manager.updateSettings({ iconData: data });
							await this.plugin.iconManager.reload();
						} catch (error) {
							new Notice("There was an error loading your icon set(s)");
							console.error(error);
						}
					};
					button.setButtonText("Add iconset").onClick(() => {
						input.click();
					});
				});
		});
		// TODO: Add list of, and way to remove, icon sets
	}
}
