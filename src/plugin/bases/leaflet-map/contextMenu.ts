import { Handler, LatLng, LeafletMouseEvent } from "leaflet";
import { App, Menu, Notice } from "obsidian";
import { Map } from "@plugin/bases/leaflet-map/map/map";
import { t } from "@plugin/i18n/locale";
import { MarkerFileModal } from "@plugin/properties/components/markerFileModal";
import { MarkerModal } from "@plugin/properties/components/markerModal";
import { Frontmatter } from "@plugin/properties/frontmatter";
import { MarkerEntry, MarkerModalMode } from "@plugin/types";
import { toOptionalFixed, writeCoordinates } from "@plugin/util";
import { Validator } from "@plugin/validation/validators";
import { ViewUtil } from "./viewUtil";

interface LeafletMarkerEvent extends LeafletMouseEvent {
	entry: MarkerEntry;
}

function isLeafletMarkerEvent(event: LeafletMouseEvent): event is LeafletMarkerEvent {
	return event.type === "markermenu";
}

export class ContextMenu extends Handler {
	private position = new LatLng(0, 0);
	private frontmatter: Frontmatter;

	constructor(
		private app: App,
		private viewUtil: ViewUtil,
		private map: Map,
	) {
		super(map);
		this.frontmatter = new Frontmatter(app);
	}

	override addHooks(): void {
		this.map
			.on("contextmenu", (event: LeafletMouseEvent) => this.show(event), this)
			.on("markermenu", (event: LeafletMouseEvent) => this.show(event), this);
	}

	override removeHooks(): void {
		this.map.off();
	}

	private show(event: LeafletMouseEvent): void {
		this.position = event.latlng;

		const menu = Menu.forEvent(event.originalEvent);
		this.setMenuContent(menu, event);
	}

	private setMenuContent(menu: Menu, event: LeafletMouseEvent): void {
		if (!["contextmenu", "markermenu"].contains(event.type)) {
			throw new Error(`Unknown event type: ${event.type}`);
		}

		/* -------- Marker section -------- */

		if (isLeafletMarkerEvent(event)) {
			// Set marker minimal zoom
			if (Validator.number(event.entry.minZoom)) {
				menu.addItem((item) =>
					item
						.setTitle(`${t("map.contextMenu.marker.resetMinimalZoom")}`)
						.setSection("marker")
						.setIcon("search")
						.onClick(() =>
							this.frontmatter.updateMarker(event.entry, { ...event.entry, minZoom: undefined }),
						),
				);
			} else {
				// Remove floating point rounding error, 5 significant digits should cover every reasonable usecase
				// If it doesn't, look up the definition of reasonable
				const currentZoom = toOptionalFixed(this.map.getZoom(), 5);
				menu.addItem((item) =>
					item
						.setTitle(`${t("map.contextMenu.marker.setMinimalZoom")} (${currentZoom})`)
						.setSection("marker")
						.setIcon("search")
						.onClick(() =>
							this.frontmatter.updateMarker(event.entry, {
								...event.entry,
								minZoom: parseFloat(currentZoom),
							}),
						),
				);
			}
		}

		if (event.type === "contextmenu") {
			// Add marker to new note
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.addToNew"))
					.setSection("marker")
					.setIcon("square-pen")
					.onClick(() =>
						new MarkerFileModal(
							this.app,
							(result) => this.frontmatter.addMarker(result),
							{
								coordinates: writeCoordinates(this.position),
								mapName: (this.viewUtil.getSettings() ?? undefined)?.name,
							},
							MarkerModalMode.Add,
						).open(),
					),
			);

			// Add marker to existing note
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.addToExisting"))
					.setSection("marker")
					.setIcon("map-pin-plus")
					.onClick(() => {
						// TODO: Implement add marker to existing note method
						// use marker modal altered to select existing note
						// maybe combine with new note>
					}),
			);
		}

		/* -------- Map section -------- */

		// Copy click coordinates
		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.copyCoordinates"))
				.setSection("map")
				.setIcon("copy")
				.onClick(() =>
					navigator.clipboard
						.writeText(writeCoordinates(this.position))
						.then(() => new Notice(t("map.controls.copy.notice.success")))
						.catch(() => new Notice(t("map.controls.copy.notice.failure"))),
				),
		);

		// Set map default zoom
		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.setDefaultZoom"))
				.setSection("map")
				.setIcon("search")
				.onClick(() => this.viewUtil.updateSetting("defaultZoom", this.map.getZoom())),
		);

		// Set map default center point
		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.setDefaultCenterPoint"))
				.setSection("map")
				.setIcon("map-pin")
				.onClick(() => this.viewUtil.updateSetting("center", writeCoordinates(this.position))),
		);

		/* -------- Danger section -------- */

		if (isLeafletMarkerEvent(event)) {
			// Edit marker
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.edit"))
					.setSection("danger")
					.setIcon("pencil-line")
					.onClick(() =>
						new MarkerModal(
							this.app,
							(result) => this.frontmatter.updateMarker(event.entry, result),
							{ ...event.entry },
							MarkerModalMode.Edit,
						).open(),
					),
			);

			// Delete marker
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.delete"))
					.setSection("danger")
					.setIcon("trash-2")
					.setWarning(true)
					.onClick(() =>
						// TODO: Ask for confirmation? Maybe not, unsure as of yet, maybe setting
						this.frontmatter.removeMarker(event.entry),
					),
			);
		}
	}
}
