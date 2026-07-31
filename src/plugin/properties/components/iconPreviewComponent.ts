import { BaseComponent, IconName } from "obsidian";
import { getIconWithDefault } from "@plugin/util";

export class IconPreviewComponent extends BaseComponent {
	private iconEl: HTMLElement;

	constructor(containerEl: HTMLElement) {
		super();
		this.iconEl = containerEl.createDiv({ cls: "bases-leaflet-view-icon-preview" });
	}

	setIcon(iconId: IconName | undefined): this {
		this.iconEl.replaceChildren(getIconWithDefault(iconId));
		return this;
	}
}
