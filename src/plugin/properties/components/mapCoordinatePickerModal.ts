import { CRS, imageOverlay, Map as LeafletMap, map as createMap } from "leaflet";
import { App, Modal, Notice } from "obsidian";
import { ImageLoader } from "@plugin/bases/leaflet-map/imageLoader";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { Coordinates } from "@plugin/types";
import { formatCoordinates } from "@plugin/util";
import { MapCandidate } from "./mapCandidates";

export class MapCoordinatePickerModal extends Modal {
	private leafletMap: LeafletMap | undefined;

	constructor(
		app: App,
		private candidate: MapCandidate,
		private onPick: (coordinates: Coordinates) => void,
	) {
		super(app);
		this.setTitle(t("marker.picker.mapModal.title"));
		this.modalEl.addClass("leaflet-map-coordinate-picker-modal");
	}

	override async onOpen(): Promise<void> {
		this.contentEl.createEl("p", { text: t("marker.picker.mapModal.description") });

		const settings = this.candidate.settings;
		const mapEl = this.contentEl.createDiv("bases-leaflet-map");
		mapEl.style.height = `${settings.height.toFixed(0)}px`;

		const imageData = await new ImageLoader(this.app).getImageData(settings.image);
		if (!imageData) {
			new Notice(t("marker.picker.notice.imageLoadFailed"));
			this.close();
			return;
		}

		this.leafletMap = createMap(mapEl, { crs: CRS.Simple, zoomSnap: C.map.default.zoomSnap });
		imageOverlay(imageData.url, imageData.bounds).addTo(this.leafletMap);
		this.leafletMap
			.setMaxBounds(imageData.bounds)
			.fitBounds(imageData.bounds)
			.setMinZoom(settings.minZoom)
			.setMaxZoom(settings.maxZoom)
			.setZoom(settings.defaultZoom);

		this.leafletMap.getContainer().setCssStyles({ cursor: "crosshair" });
		this.leafletMap.on("click", (event) => {
			this.onPick(formatCoordinates(event.latlng));
			this.close();
		});
	}

	override onClose(): void {
		this.leafletMap?.remove();
		this.leafletMap = undefined;
		this.contentEl.empty();
	}
}
