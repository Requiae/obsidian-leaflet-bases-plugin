import { LeafletMouseEvent } from "leaflet";
import { Constants as C } from "plugin/constants";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class CopyControl extends SubControl {
	override onAdded(): void {
		this.button?.appendChild(getIconWithDefault(C.map.controlIcons.copy));
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		//throw new Error("Not implemented");
	}
}
