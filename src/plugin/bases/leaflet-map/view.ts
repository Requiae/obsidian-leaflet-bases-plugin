import { BasesView, QueryController } from "obsidian";
import { ViewRegistrationBuilder } from "../viewManager";
import { MarkerManager } from "./marker";
import { map, CRS, Map, imageOverlay, LatLngBoundsExpression, layerGroup } from "leaflet";
import { ImageLoader } from "./imageLoader";
import { SchemaValidator } from "properties/schemas";
import { clamp } from "plugin/util";
import { MapObject } from "plugin/types";
import { Constants as C } from "plugin/constants";

function isValidMapSettings(value: unknown): value is MapObject {
	if (!value || typeof value !== "object") return false;
	return SchemaValidator.map(value);
}

const LeafletMapViewType: string = "leaflet-map";
export const LeafletMapViewRegistrationBuilder: ViewRegistrationBuilder = () => [
	LeafletMapViewType,
	{
		name: "Leaflet Map",
		icon: "lucide-map",
		factory: (controller, parentEl) => new LeafletMapView(controller, parentEl),
	},
];

class LeafletMapView extends BasesView {
	type = LeafletMapViewType;
	private mapSettings: MapObject;

	private containerEl: HTMLElement;
	private mapEl: HTMLElement;
	private leafletMap: Map;

	// Managers
	private markerManager: MarkerManager;
	private imageLoader: ImageLoader;

	constructor(controller: QueryController, parentEl: HTMLElement) {
		super(controller);

		this.containerEl = parentEl.createDiv("bases-leaflet-map-container");
		this.mapEl = this.containerEl.createDiv("bases-leaflet-map");

		this.markerManager = new MarkerManager(this.app);
		this.imageLoader = new ImageLoader(this.app);
	}

	onDataUpdated(): void {
		void this.updateData();
	}

	unload(): void {
		this.markerManager?.unload();
		this.leafletMap?.clearAllEventListeners();
		this.leafletMap?.remove();
	}

	private async updateData(): Promise<void> {
		if (!this.mapSettings) this.initialiseMapSettings();
		if (!this.leafletMap) await this.initialiseMap();

		this.markerManager.updateMarkers(this.data);
	}

	private async initialiseMap(): Promise<void> {
		const imageData = await this.imageLoader.getImageData(this.mapSettings.image);
		if (!imageData) return;

		const bounds: LatLngBoundsExpression = [
			[0, 0],
			[imageData.dimensions.width, imageData.dimensions.height],
		];

		const minZoom = this.mapSettings.minZoom ?? C.map.minZoom;
		const maxZoom = Math.max(this.mapSettings.maxZoom ?? C.map.maxZoom, minZoom);
		const defaultZoom = clamp(this.mapSettings.defaultZoom ?? minZoom, minZoom, maxZoom);
		const zoomDelta = this.mapSettings.zoomDelta ?? C.map.zoomDelta;

		const markerLayer = layerGroup();
		const overlay = imageOverlay(imageData.url, bounds);

		this.leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			maxBounds: bounds,
			minZoom,
			maxZoom,
			zoomSnap: C.map.zoomSnap,
			zoomDelta,
			layers: [markerLayer, overlay],
		});

		this.leafletMap.fitBounds(bounds);
		this.leafletMap.setZoom(defaultZoom);
		this.markerManager.setMap(this.leafletMap);
		this.markerManager.setMarkerLayer(markerLayer, minZoom);
	}

	private initialiseMapSettings(): void {
		if (this.mapSettings) return;

		const settings = {
			name: this.config.get("mapName"),
			image: this.config.get("image"),
			minZoom: this.config.get("minZoom"),
			maxZoom: this.config.get("maxZoom"),
			defaultZoom: this.config.get("defaultZoom"),
			zoomDelta: this.config.get("zoomDelta"),
		};

		if (isValidMapSettings(settings)) {
			this.mapSettings = settings;
			this.markerManager.setMapName(settings.name);
		}
	}
}
