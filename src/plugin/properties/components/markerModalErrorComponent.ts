import { BaseComponent } from "obsidian";

export class MarkerModalErrorComponent extends BaseComponent {
	private message: string = "";
	private textEl: HTMLDivElement;

	constructor(private containerEl: HTMLElement) {
		super();
		this.textEl = containerEl.createDiv({ cls: "bases-leaflet-view-setting-error-message" });
	}

	setMessage(message: string): this {
		this.message = message;
		this.render();
		return this;
	}

	private render(): void {
		this.textEl.setText(this.message);
		if (this.message === "") {
			this.containerEl.removeClass("invalid");
		} else {
			this.containerEl.addClass("invalid");
		}
	}
}
