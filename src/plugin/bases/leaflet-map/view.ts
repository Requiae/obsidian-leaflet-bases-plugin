import { BasesView, QueryController, ViewOption } from "obsidian";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { SchemaValidator } from "plugin/properties/schemas";
import { MapObject, ViewRegistrationBuilder } from "plugin/types";
import { clamp, isNonEmptyObject } from "plugin/util";
import { MapManager } from "./map";
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

	// Managers
	private mapManager: MapManager;
	private markerManager: MarkerManager;

	constructor(controller: QueryController, parentEl: HTMLElement) {
		super(controller);

		const containerEl = parentEl.createDiv("bases-leaflet-map-container");

		this.mapManager = new MapManager(this.app, containerEl);
		this.markerManager = new MarkerManager(
			this.app,
			this.mapManager.leafletMap,
			this.mapManager.markerLayer,
		);
	}

	onDataUpdated(): void {
		void this.updateData();
	}

	override unload(): void {
		this.markerManager.unload();
		this.mapManager.unload();
	}

	private async updateData(): Promise<void> {
		void this.updateMapSettings();
		this.markerManager.updateMarkers(this.data);
	}

	private async updateMapSettings(): Promise<void> {
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

		if (!isValidMapSettings(settings)) return;

		const minZoom = settings.minZoom ?? C.map.default.minZoom;
		const maxZoom = Math.max(settings.maxZoom ?? C.map.default.maxZoom, minZoom);

		this.markerManager.updateSettings(settings.name, minZoom);
		await this.mapManager.updateSettings({
			...settings,
			height: settings.height ?? C.map.default.height,
			minZoom,
			maxZoom,
			defaultZoom: clamp(settings.defaultZoom ?? minZoom, minZoom, maxZoom),
			zoomDelta: settings.zoomDelta ?? C.map.default.zoomDelta,
		});
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
