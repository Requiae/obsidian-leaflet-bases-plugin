import { LeafletMouseEvent } from "leaflet";
import { createOrUpdateNote } from "@plugin/bases/leaflet-map/createOrUpdateNote";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerNoteModal } from "@plugin/properties/components/markerNoteModal";
import { MarkerModalMode } from "@plugin/types";
import { getIconWithDefault, writeCoordinates } from "@plugin/util";
import { SubControl } from "../subControl";

export class CreateNoteControl extends SubControl {
	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.createNote));
			this.button.ariaLabel = t("map.controls.createNote.label");
		}
	}

	override onSelected(): void {
		this.map.getContainer().setCssStyles({ cursor: "crosshair" });
	}

	override onDeselected(): void {
		this.map.getContainer().setCssStyles({ cursor: "" });
	}

	override mapClicked(event: LeafletMouseEvent): void {
		this.createNoteAt(event);
	}

	private createNoteAt(event: LeafletMouseEvent): void {
		const coordinates = writeCoordinates(event.latlng);
		const mapName = this.options.name;

		new MarkerNoteModal(
			this.app,
			(marker, noteSelection) =>
				createOrUpdateNote(this.plugin, this.viewUtil, marker, noteSelection),
			{ coordinates, mapName },
			MarkerModalMode.Add,
			this.viewUtil.entries.map((entry) => entry.file),
		).open();
	}
}
