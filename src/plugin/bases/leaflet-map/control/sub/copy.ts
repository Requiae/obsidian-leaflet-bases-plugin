import { LeafletMouseEvent } from "leaflet";
import { Notice } from "obsidian";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class CopyControl extends SubControl {
	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.copy));
			this.button.ariaLabel = t("map.controls.copy.label");
		}
	}

	override mapClicked(event: LeafletMouseEvent): void {
		navigator.clipboard
			.writeText(`${Math.round(event.latlng.lat)}, ${Math.round(event.latlng.lng)}`)
			.then(() => new Notice(t("map.controls.copy.notice.success")))
			.catch(() => new Notice(t("map.controls.copy.notice.failure")));
	}
}
