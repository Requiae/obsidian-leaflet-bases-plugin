import { CRS, ImageOverlay, imageOverlay, LayerGroup, layerGroup, Map, map } from "leaflet";
import { Constants as C } from "@plugin/constants";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import type { RequiredMapObject } from "@plugin/types";
import { parseCoordinates } from "@plugin/util";
import { ContextMenu } from "./contextMenu";
import { ControlContainer } from "./control/container";
import { ImageLoader } from "./imageLoader";
import { ViewConfig } from "./viewConfig";

export class MapManager {
	private mapEl: HTMLElement;
	private _leafletMap: Map;
	private settings: RequiredMapObject | undefined = undefined;

	// Layers
	private _markerLayer: LayerGroup;
	private imageOverlay: ImageOverlay | undefined;

	// Managers
	private imageLoader: ImageLoader;
	private controls: ControlContainer | undefined;
	private contextMenu: ContextMenu;

	constructor(plugin: BasesLeafletViewPlugin, containerEl: HTMLElement, viewConfig: ViewConfig) {
		this.mapEl = containerEl.createDiv("bases-leaflet-map");
		this.imageLoader = new ImageLoader(plugin.app);

		// Map initialisation
		this._markerLayer = layerGroup();
		this._leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			zoomSnap: C.map.default.zoomSnap,
			layers: [this._markerLayer],
			closePopupOnClick: true,
		});

		if (plugin.settingsManager.settings.enableMeasureTool) {
			this.controls = new ControlContainer(plugin.settingsManager.settings);
			this.controls.addTo(this.leafletMap);
		}

		this.contextMenu = new ContextMenu(plugin, viewConfig, this.leafletMap);
		this.contextMenu.addHooks();
	}

	get leafletMap(): Map {
		return this._leafletMap;
	}

	get markerLayer(): LayerGroup {
		return this._markerLayer;
	}

	unload(): void {
		this.controls?.onRemove(this.leafletMap);
		this.contextMenu.removeHooks();
		this.leafletMap.clearAllEventListeners();
		this.leafletMap.remove();
	}

	async updateSettings(settings: RequiredMapObject): Promise<void> {
		await this.updateImageOverlay(settings);
		this.updateZoom(settings);
		this.updateCss(settings);

		this.controls?.updateSettings(settings);

		// This cleans up all sorts of remaining data from the leaflet map and fixes issues
		// caused by making changes to the image overlay and container size
		this.leafletMap.invalidateSize();

		this.settings = settings;
	}

	private async updateImageOverlay(settings: RequiredMapObject): Promise<void> {
		if (this.settings?.image === settings.image) return;

		const imageData = await this.imageLoader.getImageData(settings.image);
		if (!imageData) return;

		if (this.imageOverlay) this.leafletMap.removeLayer(this.imageOverlay);
		this.imageOverlay = imageOverlay(imageData.url, imageData.bounds);

		this.leafletMap
			.addLayer(this.imageOverlay)
			.setMaxBounds(imageData.bounds)
			.fitBounds(imageData.bounds);

		if (settings.center) {
			this.leafletMap.panTo(parseCoordinates(settings.center), { animate: false });
		}
	}

	private updateZoom(settings: RequiredMapObject): void {
		this.leafletMap.setMinZoom(settings.minZoom);
		this.leafletMap.setMaxZoom(settings.maxZoom);

		this.leafletMap.setZoom(settings.defaultZoom, { animate: false });

		// No clue why there are no setting functions for this but mehh, this works
		this.leafletMap.options = {
			...this.leafletMap.options,
			zoomDelta: settings.zoomDelta,
			// wheelPxPerZoomLevel defaults to 60, but the actual amount is dependent on the user's scroll device
			// This is therefore just an approximation based on the default value
			wheelPxPerZoomLevel: 60 / settings.zoomDelta,
		};
	}

	private updateCss(settings: RequiredMapObject): void {
		this.mapEl.style.height = `${settings.height.toFixed(0)}px`;
	}
}
