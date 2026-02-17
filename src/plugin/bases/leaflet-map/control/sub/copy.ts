import { LatLng, LeafletMouseEvent, Tooltip, tooltip } from "leaflet";
import { Notice } from "obsidian";
import { Constants as C } from "plugin/constants";
import { t } from "plugin/i18n/locale";
import { getIconWithDefault } from "plugin/util";
import { SubControl } from "../subControl";

export class CopyControl extends SubControl {
	private previewTooltip: Tooltip | undefined;
	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.copy));
			this.button.ariaLabel = t("map.controls.copy.label");
		}
		this.previewTooltip = tooltip({ permanent: true, offset: [15, 0] }).setLatLng([0, 0]);
	}

	override onSelected(): void {
		this.map.getContainer().setCssStyles({ cursor: "crosshair" });
		this.map.on("mousemove", (event) => {
			this.renderPreview(event.latlng);
		});
		this.previewTooltip?.addTo(this.map);
	}

	override onDeselected(): void {
		this.map.getContainer().setCssStyles({ cursor: "" });
		this.map.removeEventListener("mousemove");
		this.previewTooltip?.remove();
	}

	override mapClicked(event: LeafletMouseEvent): void {
		navigator.clipboard
			.writeText(this.getContent(event.latlng))
			.then(() => new Notice(t("map.controls.copy.notice.success")))
			.catch(() => new Notice(t("map.controls.copy.notice.failure")));
	}

	private renderPreview(mouseCoordinate: LatLng): void {
		this.previewTooltip?.setContent(this.getContent(mouseCoordinate)).setLatLng(mouseCoordinate);
	}

	private getContent(coordinate: LatLng): string {
		return `${Math.round(coordinate.lat)}, ${Math.round(coordinate.lng)}`;
	}
}
