import { CRS, ImageOverlay, LayerGroup, Map, imageOverlay, layerGroup, map } from "leaflet";
import { App } from "obsidian";
import { Constants as C } from "plugin/constants";
import { RequiredMapObject, Wiki } from "plugin/types";
import { ControlContainer } from "./control/container";
import { ImageLoader } from "./imageLoader";

export class MapManager {
	private mapEl: HTMLElement;
	private _leafletMap: Map;
	private settings: RequiredMapObject | undefined = undefined;

	// Layers
	private _markerLayer: LayerGroup;
	private imageOverlay: ImageOverlay | undefined;

	// Managers
	private imageLoader: ImageLoader;
	private controls: ControlContainer;

	constructor(app: App, containerEl: HTMLElement) {
		this.mapEl = containerEl.createDiv("bases-leaflet-map");
		this.imageLoader = new ImageLoader(app);

		// Map initialisation
		this._markerLayer = layerGroup();
		this._leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			zoomSnap: C.map.default.zoomSnap,
			layers: [this._markerLayer],
		});

		this.controls = new ControlContainer();
		this.controls.addTo(this._leafletMap);
	}

	get leafletMap(): Map {
		return this._leafletMap;
	}

	get markerLayer(): LayerGroup {
		return this._markerLayer;
	}

	unload(): void {
		this.controls.onRemove(this._leafletMap);
		this._leafletMap.clearAllEventListeners();
		this._leafletMap.remove();
	}

	async updateSettings(settings: RequiredMapObject): Promise<void> {
		await this.updateImageOverlay(settings.image);
		this.updateZoom(settings);
		this.updateCss(settings);

		this.controls.updateSettings(settings);

		// This cleans up all sorts of remaining data from the leaflet map and fixes issues
		// caused by making changes to the image overlay and container size
		this._leafletMap.invalidateSize();

		this.settings = settings;
	}

	private async updateImageOverlay(image: string | Wiki): Promise<void> {
		if (this.settings?.image === image) return;

		const imageData = await this.imageLoader.getImageData(image);
		if (!imageData) return;

		if (this.imageOverlay) this._leafletMap.removeLayer(this.imageOverlay);
		this.imageOverlay = imageOverlay(imageData.url, imageData.bounds);

		this._leafletMap
			.addLayer(this.imageOverlay)
			.setMaxBounds(imageData.bounds)
			.fitBounds(imageData.bounds);
	}

	private updateZoom(settings: RequiredMapObject): void {
		this._leafletMap.setMinZoom(settings.minZoom);
		this._leafletMap.setMaxZoom(settings.maxZoom);

		this._leafletMap.setZoom(settings.defaultZoom);

		// TODO: Zoom delta is fucked apparently
	}

	private updateCss(settings: RequiredMapObject): void {
		this.mapEl.style.height = `${settings.height.toFixed(0)}px`;
	}
}
