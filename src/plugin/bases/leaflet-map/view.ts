import { CRS, LatLngBoundsExpression, Map, imageOverlay, layerGroup, map } from "leaflet";
import { BasesView, QueryController, ViewOption } from "obsidian";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { SchemaValidator } from "plugin/properties/schemas";
import { MapObject, ViewRegistrationBuilder } from "plugin/types";
import { clamp, isNonEmptyObject } from "plugin/util";
import { ControlContainer } from "./control/container";
import { ImageLoader } from "./imageLoader";
import { MarkerManager } from "./marker";

function isValidMapSettings(value: unknown): value is MapObject {
	if (!isNonEmptyObject(value)) return false;
	return SchemaValidator.map(value);
}

export const LeafletMapViewRegistrationBuilder: ViewRegistrationBuilder = () => [
	C.view.type,
	{
		name: t("view.name"),
		icon: C.view.icon,
		factory: (controller, parentEl) => new LeafletMapView(controller, parentEl),
		options: () => LeafletMapView.getViewOptions(),
	},
];

class LeafletMapView extends BasesView {
	type = C.view.type;
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

		const height = this.mapSettings.height ?? C.map.default.height;
		const minZoom = this.mapSettings.minZoom ?? C.map.default.minZoom;
		const maxZoom = Math.max(this.mapSettings.maxZoom ?? C.map.default.maxZoom, minZoom);
		const defaultZoom = clamp(this.mapSettings.defaultZoom ?? minZoom, minZoom, maxZoom);
		const zoomDelta = this.mapSettings.zoomDelta ?? C.map.default.zoomDelta;

		this.mapEl.style.height = `${height.toFixed(0)}px`;

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
			name: this.config.get(C.view.obsidianIdentifiers.mapName),
			image: this.config.get(C.view.obsidianIdentifiers.image),
			height: this.config.get(C.view.obsidianIdentifiers.height),
			minZoom: this.config.get(C.view.obsidianIdentifiers.minZoom),
			maxZoom: this.config.get(C.view.obsidianIdentifiers.maxZoom),
			defaultZoom: this.config.get(C.view.obsidianIdentifiers.defaultZoom),
			zoomDelta: this.config.get(C.view.obsidianIdentifiers.zoomDelta),
		};

		if (isValidMapSettings(settings)) {
			this.mapSettings = settings;
			this.markerManager.setMapName(settings.name);
		}
	}

	static getViewOptions(): ViewOption[] {
		return [
			{
				displayName: t("view.options.image"),
				type: "file",
				key: C.view.obsidianIdentifiers.image,
				filter: (file) => (C.map.imageTypes as readonly string[]).includes(file.extension),
			},
			{
				displayName: t("view.options.height"),
				type: "slider",
				key: C.view.obsidianIdentifiers.height,
				default: C.map.default.height,
				...C.view.config.height,
			},
			{
				displayName: t("view.options.mapname.title"),
				type: "text",
				key: C.view.obsidianIdentifiers.mapName,
				placeholder: t("view.options.mapname.placeholder"),
			},
			{
				displayName: t("view.options.zoom.header"),
				type: "group",
				items: [
					{
						displayName: t("view.options.zoom.default"),
						type: "slider",
						key: C.view.obsidianIdentifiers.defaultZoom,
						default: C.map.default.minZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.min"),
						type: "slider",
						key: C.view.obsidianIdentifiers.minZoom,
						default: C.map.default.minZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.max"),
						type: "slider",
						key: C.view.obsidianIdentifiers.maxZoom,
						default: C.map.default.maxZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.delta"),
						type: "slider",
						key: C.view.obsidianIdentifiers.zoomDelta,
						default: C.map.default.zoomDelta,
						...C.view.config.zoom.delta,
					},
				],
			},
		];
	}
}
