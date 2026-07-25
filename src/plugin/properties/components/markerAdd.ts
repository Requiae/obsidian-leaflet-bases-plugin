import { App, Notice } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { Coordinates, MarkerModalMode, MarkerObject } from "@plugin/types";
import { BaseMapPickerModal } from "./baseMapPickerModal";
import { findLeafletMapCandidates, MapCandidate } from "./mapCandidates";
import { MapCoordinatePickerModal } from "./mapCoordinatePickerModal";
import { MarkerModal } from "./markerModal";

export class MarkerAddComponent {
	private plusEl: HTMLLIElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};

	constructor(app: App, containerEl: HTMLElement) {
		this.plusEl = activeDocument.createElement("li");
		this.plusEl.addClass("leaflet-map-property-add-item");
		this.createAddButton();

		this.plusEl.onClickEvent((event) => {
			event.stopPropagation();
			void this.pickCoordinatesThenAddMarker(app);
		});

		containerEl.appendChild(this.plusEl);
	}

	private async pickCoordinatesThenAddMarker(app: App): Promise<void> {
		const candidates = await findLeafletMapCandidates(app);
		if (candidates.length === 0) {
			new Notice(t("marker.picker.notice.noMaps"));
			return;
		}

		new BaseMapPickerModal(app, candidates, (candidate) => this.pickCoordinates(app, candidate)).open();
	}

	private pickCoordinates(app: App, candidate: MapCandidate): void {
		new MapCoordinatePickerModal(app, candidate, (coordinates) =>
			this.openMarkerModal(app, candidate, coordinates),
		).open();
	}

	private openMarkerModal(app: App, candidate: MapCandidate, coordinates: Coordinates): void {
		new MarkerModal(
			app,
			(result) => this.onChangeCallback(result),
			{ coordinates, mapName: candidate.settings.name },
			MarkerModalMode.Add,
		).open();
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

		const line1 = activeDocument.createElementNS("http://www.w3.org/2000/svg", "path");
		line1.setAttribute("d", "M3 7 11 7");
		plus.appendChild(line1);

		const line2 = activeDocument.createElementNS("http://www.w3.org/2000/svg", "path");
		line2.setAttribute("d", "M7 3 7 11");
		plus.appendChild(line2);
	}
}
