import { Handler, LatLng, LeafletMouseEvent, Map } from "leaflet";
import { BasesViewConfig, Menu, Notice } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerEntry } from "@plugin/types";
import { writeCoordinates } from "@plugin/util";

interface LeafletMarkerEvent extends LeafletMouseEvent {
	entry: MarkerEntry;
}

function isLeafletMarkerEvent(event: LeafletMouseEvent): event is LeafletMarkerEvent {
	return event.type === "markermenu";
}

export class ContextMenu extends Handler {
	private position = new LatLng(0, 0);
	private viewConfig: BasesViewConfig | undefined;

	constructor(private map: Map) {
		super(map);
	}

	setViewConfig(viewConfig: BasesViewConfig): void {
		this.viewConfig = viewConfig;
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

		// Update content according to whether or not it was on a marker

		// Marker section
		if (isLeafletMarkerEvent(event)) {
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.move"))
					.setSection("marker")
					.setIcon("hand")
					.onClick(() => {
						// TODO: Implement move/drag marker method
					}),
			);

			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.duplicate"))
					.setSection("marker")
					.setIcon("map-pin-plus")
					.onClick(() => {
						// TODO: Implement duplicate then move/drag marker method
						// skip if unreasonable
					}),
			);

			menu.addItem((item) =>
				item
					.setTitle(`${t("map.contextMenu.marker.setMinimalZoom")} (${this.map.getZoom()})`)
					.setSection("marker")
					.setIcon("search")
					.onClick(() => {
						// TODO: Implement set marker minimal zoom method
						// if marker has minimal zoom, remove instead, update title to represent that
					}),
			);
		}

		if (event.type === "contextmenu") {
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.addToNew"))
					.setSection("marker")
					.setIcon("square-pen")
					.onClick(() => {
						// TODO: Implement add marker to new note method
						// use marker modal
					}),
			);

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

		// Map section
		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.copyCoordinates"))
				.setSection("map")
				.setIcon("copy")
				.onClick(() => this.copyCoordinatesCallback()),
		);

		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.setDefaultZoom"))
				.setSection("map")
				.setIcon("search")
				.onClick(() => this.setDefaultZoomCallback()),
		);

		menu.addItem((item) =>
			item
				.setTitle(t("map.contextMenu.map.setDefaultCenterPoint"))
				.setSection("map")
				.setIcon("map-pin")
				.onClick(() => this.setDefaultCenterPointCallback()),
		);

		// Danger section
		if (isLeafletMarkerEvent(event)) {
			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.edit"))
					.setSection("danger")
					.setIcon("pencil-line")
					.onClick(() => {
						// TODO: Implement edit marker method
						// use marker modal
					}),
			);

			menu.addItem((item) =>
				item
					.setTitle(t("map.contextMenu.marker.delete"))
					.setSection("danger")
					.setIcon("trash-2")
					.setWarning(true)
					.onClick(() => {
						// TODO: Implement delete marker method
						// ask for confirmation? maybe not, unsure as of yet, maybe setting
					}),
			);
		}
	}

	private copyCoordinatesCallback(): void {
		navigator.clipboard
			.writeText(writeCoordinates(this.position))
			.then(() => new Notice(t("map.controls.copy.notice.success")))
			.catch(() => new Notice(t("map.controls.copy.notice.failure")));
	}

	private setDefaultZoomCallback(): void {
		this.viewConfig?.set(C.view.obsidianIdentifiers.defaultZoom, this.map.getZoom());
	}

	private setDefaultCenterPointCallback(): void {
		this.viewConfig?.set(C.view.obsidianIdentifiers.center, writeCoordinates(this.position));
	}
}
