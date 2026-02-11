import { App, ValueComponent } from "obsidian";
import { Constants as C } from "plugin/constants";
import { MarkerModalMode, MarkerObject } from "plugin/types";
import { getIconWithDefault } from "plugin/util";
import { MarkerModal } from "./markerModal";

export class MarkerValueComponent extends ValueComponent<MarkerObject> {
	iconEl: HTMLDivElement;
	tagEl: HTMLLIElement;
	textEl: HTMLDivElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};
	onDeleteCallback: () => void = () => {};

	constructor(
		app: App,
		containerEl: HTMLElement,
		private value: MarkerObject,
	) {
		super();

		this.tagEl = document.createElement("li");
		this.tagEl.addClass("leaflet-map-property-tag-item");

		this.tagEl.setCssStyles({ background: value.colour ?? C.marker.defaultColour });

		this.iconEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-icon" });
		this.textEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-text" });
		const closeEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-close" });
		this.createCloseButton(closeEl);

		this.updateElements();

		this.tagEl.onClickEvent((event) => {
			event.stopPropagation();
			new MarkerModal(
				app,
				(result) => {
					this.setValue(result);
					this.onChanged();
				},
				this.value,
				MarkerModalMode.Edit,
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
		this.textEl.textContent = `${this.value.mapName ? `${this.value.mapName}: ` : ""}${this.value.coordinates}`;
	}

	private createCloseButton(closeEl: HTMLDivElement): void {
		const cross = closeEl.createSvg("svg", {
			attr: {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				stroke: "#ebebec",
				"stroke-width": "1",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
			},
		});

		const line1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		line1.setAttribute("d", "M3 11 11 3");
		cross.appendChild(line1);

		const line2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		line2.setAttribute("d", "M3 3 11 11");
		cross.appendChild(line2);
	}
}
