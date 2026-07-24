import { LeafletMouseEvent } from "leaflet";
import { Notice } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerModal } from "@plugin/properties/components/markerModal";
import { MarkerModalMode, StringMap } from "@plugin/types";
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
		void this.createNoteAt(event);
	}

	private async createNoteAt(event: LeafletMouseEvent): Promise<void> {
		const coordinates = formatCoordinates(event.latlng);
		const mapName = this.options.name;

		try {
			// Delegates location/naming to Bases' own new-note handling, so it respects
			// the vault's "Default location for new notes" setting like any other note.
			await this.view.createFileForView(
				t("map.controls.createNote.defaultName"),
				(frontmatter: StringMap) => {
					frontmatter[C.property.marker.identifier] = [{ coordinates, mapName }];
				},
			);
		} catch {
			new Notice(t("map.controls.createNote.notice.failure"));
			return;
		}

		const file = this.view.app.workspace.getActiveFile();
		if (!file) return;

		new MarkerModal(
			this.view.app,
			(result) => {
				void this.view.app.fileManager.processFrontMatter(file, (frontmatter: StringMap) => {
					frontmatter[C.property.marker.identifier] = [result];
				});
			},
			{ coordinates, mapName },
			MarkerModalMode.Add,
		).open();
	}
}
