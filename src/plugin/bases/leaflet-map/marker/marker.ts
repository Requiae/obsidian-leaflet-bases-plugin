import {
	DivIcon,
	divIcon,
	DragEndEvent,
	LayerGroup,
	Marker as LeafletMarker,
	LeafletMouseEvent,
	MarkerOptions,
} from "leaflet";
import { App, IconName } from "obsidian";
import { Map } from "@plugin/bases/leaflet-map/map/map";
import { Constants as C } from "@plugin/constants";
import { Frontmatter } from "@plugin/properties/frontmatter";
import { MarkerEntry } from "@plugin/types";
import { getIconWithDefault, parseCoordinates, writeCoordinates } from "@plugin/util";

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
		iconSize: [32, 48],
		iconAnchor: [16, 48],
		tooltipAnchor: [17, -30],
	});
}

export function marker(app: App, map: Map, entry: MarkerEntry, options?: MarkerOptions): Marker {
	return new Marker(app, map, entry, {
		icon: buildMarkerIcon(entry.icon, entry.colour),
		...options,
	});
}

export class Marker extends LeafletMarker {
	private frontmatter: Frontmatter;

	constructor(
		private app: App,
		private map: Map,
		private entry: MarkerEntry,
		options?: MarkerOptions,
	) {
		super(parseCoordinates(entry.coordinates), options);
		this.frontmatter = new Frontmatter(app);

		this.bindTooltip(entry.name);

		this.on({
			click: (event) => this.onClick(event),
			mouseover: (event) => this.onHover(event),
			contextmenu: (event) => this.onContextMenu(event),
			dragend: (event) => this.updateMarkerEntry(event),
		});
	}

	override addTo(map: Map | LayerGroup<unknown>): this {
		this.options.draggable = this.map.markerDragEnabled;
		return super.addTo(map);
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

	private updateMarkerEntry(event: DragEndEvent): void {
		const marker = event.target as Marker;
		const coordinates = writeCoordinates(marker.getLatLng());

		const newEntry = { ...this.entry, coordinates: coordinates };
		this.frontmatter.updateMarker(this.entry, newEntry);
		this.entry = newEntry;
	}
}
