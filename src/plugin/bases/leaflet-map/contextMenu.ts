import { DomEvent, DomUtil, Handler, LatLng, LeafletMouseEvent, Map } from "leaflet";
import { clamp } from "@plugin/util";

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
			.on("contextmenu", (event) => this.show(event), this)
			.on("mousedown", () => this.hide(), this)
			.on("mouseout", () => this.hide(), this)
			.on("movestart", () => this.hide(), this)
			.on("zoomstart", () => this.hide(), this);
	}

	override removeHooks(): void {
		this.map
			.off("contextmenu", (event) => this.show(event), this)
			.off("mousedown", () => this.hide(), this)
			.off("mouseout", () => this.hide(), this)
			.off("movestart", () => this.hide(), this)
			.off("zoomstart", () => this.hide(), this);
	}

	private show(event: LeafletMouseEvent): void {
		this.showAt(event.latlng);
	}

	private hide(): void {
		if (this.visible) {
			this.visible = false;
			this.menuEl.setCssProps({ display: "none" });
		}
	}

	private showAt(point: LatLng): void {
		this.updatePosition(point);

		if (!this.visible) {
			this.visible = true;
			this.menuEl.setCssProps({ display: "block" });
		}
	}

	private updatePosition(point: LatLng): void {
		this.positionLatLng = point;

		const containerPos = this.map.latLngToContainerPoint(point);

		const mapSize = this.map.getContainer().getBoundingClientRect();
		const menuSize = { x: 100, y: 100 };

		if (containerPos.x + menuSize.x > mapSize.width) {
			this.menuEl.setCssProps({
				left: "auto",
				right: `${clamp(mapSize.width - containerPos.x, 0, mapSize.width - menuSize.x - 1)}px`,
			});
		} else {
			this.menuEl.setCssProps({
				left: `${Math.max(containerPos.x, 1)}px`,
				right: "auto",
			});
		}

		if (containerPos.y + menuSize.y > mapSize.height) {
			this.menuEl.setCssProps({
				top: "auto",
				bottom: `${clamp(mapSize.height - containerPos.y, 0, mapSize.height - menuSize.y - 1)}px`,
			});
		} else {
			this.menuEl.setCssProps({
				top: `${Math.max(containerPos.y, 1)}px`,
				bottom: "auto",
			});
		}
	}
}
