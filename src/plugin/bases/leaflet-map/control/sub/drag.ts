import { LeafletMouseEvent } from "leaflet";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { getIconWithDefault } from "@plugin/util";
import { SubControl } from "../subControl";

export class DragControl extends SubControl {
	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.drag));
			this.button.ariaLabel = t("map.controls.drag");
		}
	}

	override onSelected(): void {
		this.map.markerDragEnabled = true;
		this.map.refresh();
	}

	override onDeselected(): void {
		this.map.markerDragEnabled = false;
		this.map.refresh();
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		// Just pass, map panning is default leaflet behaviour
	}
}
