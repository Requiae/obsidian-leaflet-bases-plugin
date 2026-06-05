import { BasesView, QueryController } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import { ViewRegistrationBuilder } from "@plugin/types";
import { MapManager } from "./map";
import { MarkerManager } from "./marker/markerManager";
import { ViewUtil } from "./viewUtil";

export const LeafletMapViewRegistrationBuilder: ViewRegistrationBuilder = (
	plugin: BasesLeafletViewPlugin,
) => [
	C.view.type,
	{
		name: t("view.name"),
		icon: C.view.icon,
		factory: (controller, parentEl) => new LeafletMapView(controller, parentEl, plugin),
		options: () => ViewUtil.getViewOptions(),
	},
];

class LeafletMapView extends BasesView {
	type = C.view.type;
	private viewUtil: ViewUtil;

	// Managers
	private mapManager: MapManager;
	private markerManager: MarkerManager;

	constructor(controller: QueryController, parentEl: HTMLElement, plugin: BasesLeafletViewPlugin) {
		super(controller);

		const containerEl = parentEl.createDiv("bases-leaflet-map-container");

		this.viewUtil = new ViewUtil(this);

		this.mapManager = new MapManager(plugin, containerEl, this.viewUtil);
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
		const settings = this.viewUtil.getSettings();

		if (!settings) return;

		this.markerManager.updateSettings(settings.name, settings.minZoom);
		await this.mapManager.updateSettings(settings);
	}
}
