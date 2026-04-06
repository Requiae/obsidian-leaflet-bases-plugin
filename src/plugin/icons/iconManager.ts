import { addIcon, removeIcon } from "obsidian";
import { icons as gameIcons } from "@iconify-json/game-icons";
import { IconifyJSON } from "@iconify/types";
import { Manager } from "@plugin/types";

export class IconManager extends Manager {
	async load(): Promise<void> {
		// TODO: register only sets enabled by settings
		this.registerIconSet(gameIcons);
	}

	unload(): void {
		this.removeIconSet(gameIcons);
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
			removeIcon(`${iconSet.prefix}-${key}`);
		}
	}
}
