import { App, ValueComponent } from "obsidian";
import { MarkerObject } from "plugin/types";
import { getIconWithDefault } from "plugin/util";
import { MarkerModal } from "./markerModal";

export class MarkerValueComponent extends ValueComponent<MarkerObject> {
	iconEl: HTMLDivElement;
	tagEl: HTMLLIElement;
	textEl: HTMLDivElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};
	onDeleteCallback: () => void = () => {};

	constructor(
		private app: App,
		containerEl: HTMLElement,
		private value: MarkerObject,
	) {
		super();

		this.tagEl = document.createElement("li");
		this.tagEl.addClass("leaflet-map-property-tag-item");

		// TODO: set colour to marker colour
		this.tagEl.setCssStyles({ background: "#21409a" });

		this.iconEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-icon" });
		this.textEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-text" });
		const closeEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-close" });

		this.updateElements();

		this.tagEl.onClickEvent((event) => {
			event.stopPropagation();
			new MarkerModal(
				this.app,
				(result) => {
					this.setValue(result);
					this.onChanged();
				},
				this.value,
			).open();
		});
		closeEl.onClickEvent((event) => {
			event.stopPropagation();
			this.onDeleted();
		});

		containerEl.appendChild(this.tagEl);
	}

	unload() {
		this.onChange(() => {});
	}

	getValue(): MarkerObject {
		return this.value;
	}

	setValue(value: MarkerObject): this {
		this.value = value;
		this.updateElements();
		return this;
	}

	onChanged() {
		this.onChangeCallback(this.getValue());
	}

	onChange(cb: (value: MarkerObject) => void): this {
		this.onChangeCallback = cb;
		return this;
	}

	onDeleted() {
		this.onDeleteCallback();
	}

	onDelete(cb: () => void): this {
		this.onDeleteCallback = cb;
		return this;
	}

	private updateElements() {
		this.iconEl.replaceChildren(getIconWithDefault(this.value.icon));
		this.textEl.textContent = `${this.value.mapName}: ${this.value.coordinates}`;
	}
}
