import { LeafletMouseEvent } from "leaflet";
import { TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerNoteModal } from "@plugin/properties/components/markerNoteModal";
import { MarkerModalMode, MarkerObject, NoteSelection } from "@plugin/types";
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
			(marker, noteSelection) => this.createOrUpdateFile(marker, noteSelection),
			{ coordinates, mapName },
			MarkerModalMode.Add,
			this.viewUtil.entries.map((entry) => entry.file),
		).open();
	}

	private createOrUpdateFile(marker: MarkerObject, noteSelection: NoteSelection): void {
		if (noteSelection instanceof TFile) {
			this.addMarkerToExistingFile(noteSelection, marker);
			return;
		}

		// Delegates location/naming to Bases' own new-note handling, so it respects
		// the vault's "Default location for new notes" setting like any other note.
		this.viewUtil.createFileForView({ [C.property.marker.identifier]: [marker] }, noteSelection);
	}

	private addMarkerToExistingFile(file: TFile, marker: MarkerObject): void {
		void this.app.fileManager.processFrontMatter(file, (frontmatter: Record<string, unknown>) => {
			const existingMarkers = Array.isArray(frontmatter[C.property.marker.identifier])
				? (frontmatter[C.property.marker.identifier] as unknown[])
				: [];
			frontmatter[C.property.marker.identifier] = [...existingMarkers, marker];
		});
	}
}
