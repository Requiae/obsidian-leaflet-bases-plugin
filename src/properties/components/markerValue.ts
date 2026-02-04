import { ValueComponent } from "obsidian";
import { MarkerObject } from "plugin/types";
import { getIconWithDefault } from "plugin/util";

export class MarkerValueComponent extends ValueComponent<MarkerObject> {
	private value: MarkerObject;

	iconEl: HTMLDivElement;
	tagEl: HTMLLIElement;
	textEl: HTMLDivElement;

	componentsContainerEl: HTMLElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};
	onDeleteCallback: () => void = () => {};

	constructor(containerEl: HTMLElement) {
		super();

		this.tagEl = document.createElement("li");
		this.tagEl.addClass("leaflet-map-property-tag-item");

		// TODO: set colour to marker colour
		this.tagEl.setCssStyles({ background: "#21409a" });

		this.iconEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-icon" });
		this.textEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-text" });
		const closeEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-close" });

		this.tagEl.onClickEvent((event) => {
			event.stopPropagation();
			//console.log("modal");
			// TODO: the whole modal thing

			//this.setValue(newValue);
			this.onChanged();
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
		this.iconEl.replaceChildren(getIconWithDefault(value.icon));
		this.textEl.textContent = `${value.mapName}: ${value.coordinates.toString()}`;

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
}
