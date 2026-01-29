import { BasesView, QueryController } from "obsidian";
import { ViewRegistrationBuilder } from "../viewManager";
import { MarkerManager } from "./markerManager";
import { map, CRS, Map, imageOverlay, LatLngBoundsExpression } from "leaflet";
import { ImageLoader } from "./imageLoader";
import { schemaValidatorFactory } from "properties/schemas";

type wiki = string[][];
interface MapSettings {
	name?: string;
	image: string | wiki;
	minZoom?: number;
	maxZoom?: number;
	initialZoom?: number;
	zoomStep?: number;
}
function isValidMapSettings(value: unknown): value is MapSettings {
	if (!value || typeof value !== "object") return false;
	return schemaValidatorFactory("map")(value); // TODO: is broken, fix
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

		this.markerManager = new MarkerManager();
		this.imageLoader = new ImageLoader(this.app);
	}

	onDataUpdated(): void {
		void this.updateData();
	}

	private async updateData(): Promise<void> {
		if (!this.mapSettings) this.initialiseMapSettings();
		if (!this.leafletMap) await this.initialiseMap();

		this.markerManager.updateMarkers(this.data);
	}

	private async initialiseMap(): Promise<void> {
		const image = this.config.get("image"); // TODO: Get this from this.mapSettings
		const imageData = await this.imageLoader.getImageData(image);
		if (!imageData) return;

		const bounds: LatLngBoundsExpression = [
			[0, 0],
			[imageData.dimensions.width, imageData.dimensions.height],
		];

		this.leafletMap = map(this.mapEl, {
			crs: CRS.Simple,
			maxBounds: bounds,
			minZoom: 0,
			maxZoom: 2,
			zoomSnap: 0.01,
			zoomDelta: 0.5,
		});

		const overlay = imageOverlay(imageData.url, bounds);
		overlay.addTo(this.leafletMap);

		this.leafletMap.fitBounds(bounds);
		this.leafletMap.setZoom(0);
	}

	private initialiseMapSettings(): void {
		if (this.mapSettings) return;

		const settings = {
			name: this.config.get("name"),
			image: this.config.get("image"),
			minZoom: this.config.get("minZoom"),
			maxZoom: this.config.get("maxZoom"),
			initialZoom: this.config.get("initialZoom"),
			zoomStep: this.config.get("zoomStep"),
		};

		if (isValidMapSettings(settings)) this.mapSettings = settings;
		console.log(this.mapSettings);
	}
}
