import { LeafletMouseEvent } from "leaflet";
import { Constants as C } from "plugin/constants";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class PanControl extends SubControl {
	override onAdded(): void {
		this.button?.appendChild(getIconWithDefault(C.map.controlIcons.pan));
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		//throw new Error("Not implemented");
	}
}
