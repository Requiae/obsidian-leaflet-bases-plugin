import { LeafletMouseEvent } from "leaflet";
import { Notice, TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerModal } from "@plugin/properties/components/markerModal";
import { MarkerModalMode, MarkerObject, StringMap } from "@plugin/types";
import { formatCoordinates, getIconWithDefault } from "@plugin/util";
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
		const coordinates = formatCoordinates(event.latlng);
		const mapName = this.options.name;

		let noteSelection: string | TFile | undefined;

		new MarkerModal(
			this.view.app,
			(result) => {
				void this.createOrUpdateFile(result, noteSelection);
			},
			{ coordinates, mapName },
			MarkerModalMode.Add,
			{
				existingFiles: this.view.data.data.map((entry) => entry.file),
				onChange: (value) => (noteSelection = value),
			},
		).open();
	}

	private async createOrUpdateFile(
		marker: MarkerObject,
		noteSelection: string | TFile | undefined,
	): Promise<void> {
		if (noteSelection instanceof TFile) {
			await this.addMarkerToExistingFile(noteSelection, marker);
			return;
		}

		try {
			// Delegates location/naming to Bases' own new-note handling, so it respects
			// the vault's "Default location for new notes" setting like any other note.
			await this.view.createFileForView(
				noteSelection ?? t("map.controls.createNote.defaultName"),
				(frontmatter: StringMap) => {
					frontmatter[C.property.marker.identifier] = [marker];
				},
			);
		} catch {
			new Notice(t("map.controls.createNote.notice.failure"));
		}
	}

	private async addMarkerToExistingFile(file: TFile, marker: MarkerObject): Promise<void> {
		await this.view.app.fileManager.processFrontMatter(file, (frontmatter: StringMap) => {
			const existing: unknown = frontmatter[C.property.marker.identifier];
			const existingMarkers: MarkerObject[] = Array.isArray(existing)
				? (existing as MarkerObject[])
				: existing
					? [existing as MarkerObject]
					: [];
			frontmatter[C.property.marker.identifier] = [...existingMarkers, marker];
		});
	}
}
