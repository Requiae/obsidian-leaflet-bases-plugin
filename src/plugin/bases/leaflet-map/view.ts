import { CRS, LatLngBoundsExpression, Map, imageOverlay, layerGroup, map } from "leaflet";
import { BasesView, QueryController } from "obsidian";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { SchemaValidator } from "plugin/properties/schemas";
import { MapObject } from "plugin/types";
import { clamp, isNonEmptyObject } from "plugin/util";
import { ViewRegistrationBuilder } from "../viewManager";
import { ControlContainer } from "./control/container";
import { ImageLoader } from "./imageLoader";
import { MarkerManager } from "./marker";

function isValidMapSettings(value: unknown): value is MapObject {
	if (!isNonEmptyObject(value)) return false;
	return SchemaValidator.map(value);
}

const LeafletMapViewType: string = "leaflet-map";
export const LeafletMapViewRegistrationBuilder: ViewRegistrationBuilder = () => [
	LeafletMapViewType,
	{
		name: t("view.name"),
		icon: "lucide-map",
		factory: (controller, parentEl) => new LeafletMapView(controller, parentEl),
	},
];

class LeafletMapView extends BasesView {
	type = LeafletMapViewType;
	private mapSettings: MapObject | undefined;

	private containerEl: HTMLElement;
	private mapEl: HTMLElement;
	private leafletMap: Map | undefined;

	// Managers
	private markerManager: MarkerManager;
	private imageLoader: ImageLoader;
	private controls: ControlContainer;

	constructor(controller: QueryController, parentEl: HTMLElement) {
		super(controller);

		this.containerEl = parentEl.createDiv("bases-leaflet-map-container");
		this.mapEl = this.containerEl.createDiv("bases-leaflet-map");

		this.markerManager = new MarkerManager(this.app);
		this.imageLoader = new ImageLoader(this.app);
		this.controls = new ControlContainer();
	}

	onDataUpdated(): void {
		void this.updateData();
	}

	override unload(): void {
		this.markerManager?.unload();
		this.controls.onRemove(this.leafletMap);
		this.leafletMap?.clearAllEventListeners();
		this.leafletMap?.remove();
	}

	private async updateData(): Promise<void> {
		if (!this.mapSettings) this.initialiseMapSettings();
		if (!this.leafletMap) await this.initialiseMap();

		this.markerManager.updateMarkers(this.data);
	}

	private async initialiseMap(): Promise<void> {
		if (!this.mapSettings) throw new Error("Map settings not initialised");

		const imageData = await this.imageLoader.getImageData(this.mapSettings.image);
		if (!imageData) return;

		const bounds: LatLngBoundsExpression = [
			[0, 0],
			[imageData.dimensions.width, imageData.dimensions.height],
		];

		const minZoom = this.mapSettings.minZoom ?? C.map.default.minZoom;
		const maxZoom = Math.max(this.mapSettings.maxZoom ?? C.map.default.maxZoom, minZoom);
		const defaultZoom = clamp(this.mapSettings.defaultZoom ?? minZoom, minZoom, maxZoom);
		const zoomDelta = this.mapSettings.zoomDelta ?? C.map.default.zoomDelta;

		const markerLayer = layerGroup();
		const overlay = imageOverlay(imageData.url, bounds);

		this.leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			maxBounds: bounds,
			minZoom,
			maxZoom,
			zoomSnap: C.map.default.zoomSnap,
			zoomDelta,
			layers: [markerLayer, overlay],
		});

		this.controls.addTo(this.leafletMap);
		this.leafletMap.fitBounds(bounds).setZoom(defaultZoom);
		this.markerManager.setMap(this.leafletMap, markerLayer, minZoom);
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
