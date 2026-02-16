import { LeafletMouseEvent } from "leaflet";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class PanControl extends SubControl {
	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.pan));
			this.button.ariaLabel = t("map.controls.pan");
		}
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		//throw new Error("Not implemented");
	}
}
