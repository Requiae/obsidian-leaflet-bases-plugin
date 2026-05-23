import { DomEvent, DomUtil, Handler, LatLng, LeafletMouseEvent, Map } from "leaflet";
import { clamp } from "@plugin/util";

interface EventPos {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export class ContextMenu extends Handler {
	private menuEl: HTMLElement;
	private map: Map;

	private positionLatLng = new LatLng(0, 0);
	private visible = false;

	constructor(map: Map) {
		super(map);

		this.map = map;
		this.menuEl = DomUtil.create("div", "bases-leaflet-view-context-menu", map.getContainer());

		DomEvent.on(this.menuEl, "click", DomEvent.stop)
			.on(this.menuEl, "mousedown", DomEvent.stop)
			.on(this.menuEl, "dblclick", DomEvent.stop)
			.on(this.menuEl, "contextmenu", DomEvent.stop);
	}

	override addHooks(): void {
		this.map
			.on("contextmenu", (event: LeafletMouseEvent) => this.show(event), this)
			.on("markermenu", (event: LeafletMouseEvent) => this.show(event), this)
			.on("mousedown", () => this.hide(), this)
			.on("mouseout", () => this.hide(), this)
			.on("movestart", () => this.hide(), this)
			.on("zoomstart", () => this.hide(), this);
	}

	override removeHooks(): void {
		this.map.off();
		DomEvent.off(this.menuEl);
	}

	private show(event: LeafletMouseEvent): void {
		this.updateContent(event);
		this.updatePosition(event);

		if (!this.visible) {
			this.visible = true;
			this.menuEl.setCssProps({ display: "block" });
		}
	}

	private hide(): void {
		if (this.visible) {
			this.visible = false;
			this.menuEl.setCssProps({ display: "none" });
		}
	}

	private updateContent(event: LeafletMouseEvent): void {
		// Update content according to whether or not it was on a marker
	}

	private updatePosition(event: LeafletMouseEvent): void {
		this.positionLatLng = event.latlng;

		const eventPos = this.getEventPos(event);

		const mapSize = this.map.getContainer().getBoundingClientRect();
		const menuSize = { x: 100, y: 100 }; // TODO: Menu size is not calculated yet

		if (eventPos.right + menuSize.x > mapSize.width) {
			this.menuEl.setCssProps({
				left: "auto",
				right: `${clamp(mapSize.width - eventPos.left, 0, mapSize.width - menuSize.x - 1)}px`,
			});
		} else {
			this.menuEl.setCssProps({
				left: `${Math.max(eventPos.right, 1)}px`,
				right: "auto",
			});
		}

		if (eventPos.top + menuSize.y > mapSize.height) {
			this.menuEl.setCssProps({
				top: "auto",
				bottom: `${clamp(mapSize.height - eventPos.bottom, 0, mapSize.height - menuSize.y - 1)}px`,
			});
		} else {
			this.menuEl.setCssProps({
				top: `${Math.max(eventPos.top, 1)}px`,
				bottom: "auto",
			});
		}
	}

	private getEventPos(event: LeafletMouseEvent): EventPos {
		const containerPoint = this.map.latLngToContainerPoint(event.latlng);

		if (!["contextmenu", "markermenu"].contains(event.type)) {
			throw new Error(`Unknown event type: ${event.type}`);
		}

		return {
			// TODO: Markersize and anchor are hardcoded
			left: containerPoint.x - (event.type === "markermenu" ? 16 : 0),
			right: containerPoint.x + (event.type === "markermenu" ? 16 : 0),
			top: containerPoint.y - (event.type === "markermenu" ? 48 : 0),
			bottom: containerPoint.y,
		};
	}
}
