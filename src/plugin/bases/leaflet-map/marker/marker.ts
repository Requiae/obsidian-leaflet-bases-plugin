import {
	DivIcon,
	divIcon,
	Marker as LeafletMarker,
	LeafletMouseEvent,
	Map,
	MarkerOptions,
} from "leaflet";
import { App, IconName } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { MarkerEntry } from "@plugin/types";
import { getIconWithDefault, parseCoordinates } from "@plugin/util";

function buildMarkerIcon(iconId: IconName | undefined, colour: string | undefined): DivIcon {
	const xmlSerializer = new XMLSerializer();
	const innerIcon = getIconWithDefault(iconId);
	innerIcon.addClass("leaflet-marker-inner-icon");

	return divIcon({
		className: "leaflet-marker-icon",
		html: `
            <svg class="leaflet-marker-pin" style="fill:${colour ?? C.marker.defaultColour}" viewBox="0 0 32 48">
                <path d="m32,19c0,12 -12,24 -16,29c-4,-5 -16,-16 -16,-29a16,19 0 0 1 32,0"/>
            </svg>
            ${xmlSerializer.serializeToString(innerIcon)}`,
		iconSize: [32, 48], // TODO: Markersize is hardcoded
		iconAnchor: [16, 48], // TODO: Anchor is hardcoded
		tooltipAnchor: [17, -30],
	});
}

export function marker(app: App, map: Map, entry: MarkerEntry): Marker {
	return new Marker(app, map, entry, {
		icon: buildMarkerIcon(entry.icon, entry.colour),
	});
}

export class Marker extends LeafletMarker {
	constructor(
		private app: App,
		private map: Map,
		private entry: MarkerEntry,
		options?: MarkerOptions,
	) {
		super(parseCoordinates(entry.coordinates), options);

		this.bindTooltip(entry.name);

		this.on("click", (event) => this.onClick(event));
		this.on("mouseover", (event) => this.onHover(event));
		this.on("contextmenu", (event) => this.onContextMenu(event));
	}

	private onClick(event: LeafletMouseEvent): void {
		// TODO: Add middle mouse click detection
		// Leaflet does not detect middle mouse click, and the mouseup event does not lead to a smooth experience
		void this.app.workspace.openLinkText("", this.entry.link, event.originalEvent.ctrlKey);
	}

	private onHover(event: LeafletMouseEvent): void {
		this.app.workspace.trigger("hover-link", {
			event: event.originalEvent,
			source: "bases",
			hoverParent: this.app.renderContext,
			targetEl: this.getElement(),
			linktext: this.entry.link,
		});
	}

	private onContextMenu(event: LeafletMouseEvent): void {
		event.originalEvent.preventDefault();
		this.map.fire("markermenu", { ...event, entry: this.entry });
	}
}
