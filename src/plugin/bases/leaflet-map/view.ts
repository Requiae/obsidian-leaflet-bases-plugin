import { BasesView, QueryController } from "obsidian";
import { MapManager } from "@plugin/bases/leaflet-map/map/mapManager";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import { ViewRegistrationBuilder } from "@plugin/types";
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

	constructor(controller: QueryController, parentEl: HTMLElement, plugin: BasesLeafletViewPlugin) {
		super(controller);

		const containerEl = parentEl.createDiv("bases-leaflet-map-container");

		this.viewUtil = new ViewUtil(this, plugin.settingsManager);

		this.mapManager = new MapManager(plugin, containerEl, this.viewUtil);
	}

	onDataUpdated(): void {
		void this.updateData();
	}

	override unload(): void {
		this.mapManager.unload();
	}

	private async updateData(): Promise<void> {
		void this.updateMapSettings();
		this.mapManager.updateData(this.data);
	}

	private async updateMapSettings(): Promise<void> {
		const settings = this.viewUtil.getSettings();

		if (!settings) return;

		await this.mapManager.updateSettings(settings);
	}
}
