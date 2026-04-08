import { addIcon, removeIcon } from "obsidian";
import { IconifyJSON } from "@iconify/types";
import { Manager } from "@plugin/types";

export class IconManager extends Manager {
	async load(): Promise<void> {
		for (let iconSet of this.plugin.settingsManager.settings.iconData) {
			this.registerIconSet(iconSet);
		}
	}

	unload(): void {
		for (let iconSet of this.plugin.settingsManager.settings.iconData) {
			this.removeIconSet(iconSet);
		}
	}

	private registerIconSet(iconSet: IconifyJSON): void {
		for (const [key, icon] of Object.entries(iconSet.icons)) {
			if (icon.body && !icon.hidden) {
				const width = icon.width ?? iconSet.width ?? 24;
				const height = icon.height ?? iconSet.height ?? 24;
				const scale = `scale(${100 / width} ${100 / height})`;
				const svg = `<g transform="${scale}">${icon.body}</g>`;
				addIcon(`${iconSet.prefix}:${key}`, svg);
			}
		}
	}

	private removeIconSet(iconSet: IconifyJSON): void {
		for (const key in iconSet.icons) {
			removeIcon(`${iconSet.prefix}:${key}`);
		}
	}
}
