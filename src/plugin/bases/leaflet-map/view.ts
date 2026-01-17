import { BasesView, QueryController } from "obsidian";
import { ViewRegistrationBuilder } from "../viewManager";
import { BaseLeafletViewPlugin } from "plugin/plugin";
import { MarkerManager } from "./markerManager";

const LeafletMapViewType: string = "leaflet-map";
export const LeafletMapViewRegistrationBuilder: ViewRegistrationBuilder = (
	plugin: BaseLeafletViewPlugin,
) => [
	LeafletMapViewType,
	{
		name: "Leaflet Map",
		icon: "lucide-map",
		factory: (controller, containerEl) => new LeafletMapView(controller, containerEl, plugin),
	},
];

class LeafletMapView extends BasesView {
	type = LeafletMapViewType;

	// Managers
	private markerManager: MarkerManager;

	constructor(controller: QueryController, scrollEl: HTMLElement, plugin: BaseLeafletViewPlugin) {
		super(controller);

		this.markerManager = new MarkerManager();
	}

	onDataUpdated(): void {
		this.markerManager.updateMarkers(this.data);
	}
}
