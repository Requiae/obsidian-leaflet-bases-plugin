import { CRS, ImageOverlay, imageOverlay, LayerGroup, layerGroup } from "leaflet";
import { BasesEntry } from "obsidian";
import { ContextMenu } from "@plugin/bases/leaflet-map/contextMenu";
import { ControlContainer } from "@plugin/bases/leaflet-map/control/container";
import { ImageLoader } from "@plugin/bases/leaflet-map/imageLoader";
import { map, Map } from "@plugin/bases/leaflet-map/map/map";
import { MarkerManager } from "@plugin/bases/leaflet-map/marker/markerManager";
import { ViewUtil } from "@plugin/bases/leaflet-map/viewUtil";
import { Constants as C } from "@plugin/constants";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import type { RequiredMapObject } from "@plugin/types";
import { parseCoordinates } from "@plugin/util";

export class MapManager {
	private mapEl: HTMLElement;
	private leafletMap: Map;
	private settings: RequiredMapObject | undefined = undefined;

	// Layers
	private markerLayer: LayerGroup;
	private imageOverlay: ImageOverlay | undefined;

	// Managers
	private markerManager: MarkerManager;
	private imageLoader: ImageLoader;
	private controls: ControlContainer | undefined;
	private contextMenu: ContextMenu;

	constructor(plugin: BasesLeafletViewPlugin, containerEl: HTMLElement, viewUtil: ViewUtil) {
		this.mapEl = containerEl.createDiv("bases-leaflet-map");
		this.imageLoader = new ImageLoader(plugin.app);

		// Map initialisation
		this.markerLayer = layerGroup();
		this.leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			zoomSnap: C.map.default.zoomSnap,
			layers: [this.markerLayer],
			closePopupOnClick: true,
			// Leaflet's Keyboard handler focuses the map container on every mousedown
			// (any button, not just left-click) to enable arrow-key panning, then tries
			// to undo the resulting scroll via `window.scrollTo()`. That only resets a
			// real window scroll; Obsidian's panes scroll inside their own divs, so the
			// undo is a no-op and every mousedown (e.g. right-clicking for the context
			// menu) permanently shifts the surrounding pane. This plugin doesn't rely on
			// keyboard panning, so disable it outright.
			keyboard: false,
		});

		if (
			plugin.settingsManager.settings.enableMeasureTool ||
			plugin.settingsManager.settings.enableDragTool ||
			plugin.settingsManager.settings.enableCreateNoteTool
		) {
			this.controls = new ControlContainer(plugin.app, viewUtil, plugin.settingsManager.settings);
			this.controls.addTo(this.leafletMap);
		}

		this.contextMenu = new ContextMenu(plugin.app, viewUtil, this.leafletMap);
		this.contextMenu.addHooks();

		this.markerManager = new MarkerManager(plugin.app, this.leafletMap, this.markerLayer);
	}

	unload(): void {
		this.markerManager.unload();
		this.controls?.onRemove(this.leafletMap);
		this.contextMenu.removeHooks();
		this.leafletMap.clearAllEventListeners();
		this.leafletMap.remove();
	}

	updateData(data: { data: BasesEntry[] }): void {
		this.markerManager.updateMarkers(data);
	}

	async updateSettings(settings: RequiredMapObject): Promise<void> {
		this.markerManager.updateSettings(settings.name, settings.markerProperty, settings.minZoom);

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
		this.leafletMap.setZoom(settings.defaultZoom, { animate: false });

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
