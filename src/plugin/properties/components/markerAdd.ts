import { App } from "obsidian";
import { MarkerModalMode, MarkerObject } from "plugin/types";
import { MarkerModal } from "./markerModal";

export class MarkerAddComponent {
	private plusEl: HTMLLIElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};

	constructor(app: App, containerEl: HTMLElement) {
		this.plusEl = document.createElement("li");
		this.plusEl.addClass("leaflet-map-property-add-item");
		this.createAddButton();

		this.plusEl.onClickEvent((event) => {
			event.stopPropagation();
			new MarkerModal(
				app,
				(result) => this.onChangeCallback(result),
				undefined,
				MarkerModalMode.Add,
			).open();
		});

		containerEl.appendChild(this.plusEl);
	}

	unload() {
		this.onChange(() => {});
	}

	onChange(cb: (value: MarkerObject) => void): this {
		this.onChangeCallback = cb;
		return this;
	}

	private createAddButton(): void {
		const plus = this.plusEl.createSvg("svg", {
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
		line1.setAttribute("d", "M3 7 11 7");
		plus.appendChild(line1);

		const line2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		line2.setAttribute("d", "M7 3 7 11");
		plus.appendChild(line2);
	}
}
