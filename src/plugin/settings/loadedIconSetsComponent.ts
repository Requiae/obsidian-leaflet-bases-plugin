import { getIcon } from "obsidian";
import { IconManager } from "@plugin/icons/iconManager";
import { IconifyJSONIconsObject } from "@plugin/types";
import BasesLeafletViewPlugin from "../../main";
import { SettingsManager } from "./settingsManager";

export class LoadedIconSetsComponent {
	private containerEl: HTMLElement;

	private settingsManager: SettingsManager;
	private iconManager: IconManager;

	constructor(
		private parentEl: HTMLElement,
		plugin: BasesLeafletViewPlugin,
	) {
		this.settingsManager = plugin.settingsManager;
		this.iconManager = plugin.iconManager;

		parentEl.replaceChildren();
		this.containerEl = parentEl.createDiv({ cls: "setting-items" });

		this.render();
	}

	render(): void {
		if (this.settingsManager.settings.iconData.length === 0) {
			this.parentEl.setCssStyles({ display: "none" });
			return;
		}

		this.parentEl.setCssStyles({ display: "block" });

		this.containerEl.replaceChildren();
		for (let [index, iconSet] of this.settingsManager.settings.iconData.entries()) {
			this.buildRow(index, iconSet);
		}
	}

	private buildRow(index: number, iconSet: IconifyJSONIconsObject): void {
		const row = this.containerEl.createDiv({ cls: "setting-item" });
		row.createDiv({ cls: "setting-item-info" }, (info) => {
			info.createDiv({ text: iconSet.info?.name ?? iconSet.prefix, cls: "setting-item-name" });
			info.createDiv({ text: iconSet.info?.author.name ?? "", cls: "setting-item-description" });
		});
		row.createDiv({ cls: "setting-item-control" }, (close) => {
			close.createDiv({ cls: "clickable-icon" }, (div) => {
				const icon = getIcon("lucide-x");
				if (icon) div.append(icon);
				div.onclick = async () => {
					// es2023 .toSplice() is not available so we copy, then splice
					const copy = this.settingsManager.settings.iconData.slice();
					copy.splice(index, 1);

					this.iconManager.unload();
					await this.settingsManager.updateSettings({ iconData: copy });
					await this.iconManager.load();

					this.render();
				};
			});
		});
	}
}
