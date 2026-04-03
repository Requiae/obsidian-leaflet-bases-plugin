import { icons as gameIcons } from "@iconify-json/game-icons";
import BaseLeafletViewPlugin from "../../main";
import { IconifyJSON } from "@iconify/types";
import { addIcon, removeIcon } from "obsidian";

export class IconManager {
	constructor(public plugin: BaseLeafletViewPlugin) {
		this.registerIconSet(gameIcons);
	}

	unload() {
		this.removeIconSet(gameIcons);
	}

	private registerIconSet(iconSet: IconifyJSON) {
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

	private removeIconSet(iconSet: IconifyJSON) {
		for (const key in iconSet.icons) {
			removeIcon(`${iconSet.prefix}-${key}`);
		}
	}
}
