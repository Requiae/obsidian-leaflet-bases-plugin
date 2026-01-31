import { BasesView, QueryController } from "obsidian";
import { ViewRegistrationBuilder } from "../viewManager";
import { MarkerManager } from "./marker";
import { map, CRS, Map, imageOverlay, LatLngBoundsExpression } from "leaflet";
import { ImageLoader } from "./imageLoader";
import { schemaValidatorFactory } from "properties/schemas";
import { defaultMapSettings } from "plugin/constants";
import { clamp } from "plugin/util";

interface MapSettings {
	name?: string;
	image: string | string[][]; // Wiki links take the shape of string[][]
	minZoom?: number;
	maxZoom?: number;
	initialZoom?: number;
	zoomStep?: number;
}

function isValidMapSettings(value: unknown): value is MapSettings {
	if (!value || typeof value !== "object") return false;
	return schemaValidatorFactory("map")(value);
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
	private mapSettings: MapSettings;

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

	private async updateData(): Promise<void> {
		if (!this.mapSettings) this.initialiseMapSettings();
		if (!this.leafletMap) await this.initialiseMap();

		this.markerManager.updateMarkers(this.data);

		this.markerManager.markers.forEach((marker) => {
			marker.addTo(this.leafletMap);
		});
	}

	private async initialiseMap(): Promise<void> {
		const imageData = await this.imageLoader.getImageData(this.mapSettings.image);
		if (!imageData) return;

		const bounds: LatLngBoundsExpression = [
			[0, 0],
			[imageData.dimensions.width, imageData.dimensions.height],
		];

		const minZoom = this.mapSettings.minZoom ?? defaultMapSettings.minZoom;
		const maxZoom = Math.max(this.mapSettings.maxZoom ?? defaultMapSettings.maxZoom, minZoom);
		const initialZoom = clamp(this.mapSettings.initialZoom ?? minZoom, minZoom, maxZoom);
		const zoomDelta = this.mapSettings.zoomStep ?? defaultMapSettings.zoomStep;

		this.leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			maxBounds: bounds,
			minZoom,
			maxZoom,
			zoomSnap: defaultMapSettings.zoomSnap,
			zoomDelta,
		});

		const overlay = imageOverlay(imageData.url, bounds);
		overlay.addTo(this.leafletMap);

		this.leafletMap.fitBounds(bounds);
		this.leafletMap.setZoom(initialZoom);
	}

	private initialiseMapSettings(): void {
		if (this.mapSettings) return;

		const settings = {
			name: this.config.get("mapName"),
			image: this.config.get("image"),
			minZoom: this.config.get("minZoom"),
			maxZoom: this.config.get("maxZoom"),
			initialZoom: this.config.get("initialZoom"),
			zoomStep: this.config.get("zoomStep"),
		};

		if (isValidMapSettings(settings)) {
			this.mapSettings = settings;
			this.markerManager.setMapName(settings.name);
		}
	}
}
