import { LeafletMouseEvent } from "leaflet";
import { Notice, TFolder } from "obsidian";
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
		try {
			const folder = this.app.fileManager.getNewFileParent("");
			const file = await this.app.vault.create(this.getUniquePath(folder), "");
			await this.app.workspace.getLeaf("tab").openFile(file);

			new MarkerModal(
				this.app,
				(result) => {
					void this.app.fileManager.processFrontMatter(file, (frontmatter: StringMap) => {
						frontmatter[C.property.marker.identifier] = [result];
					});
				},
				{ coordinates: formatCoordinates(event.latlng), mapName: this.options.name },
				MarkerModalMode.Add,
			).open();
		} catch {
			new Notice(t("map.controls.createNote.notice.failure"));
		}
	}

	private getUniquePath(folder: TFolder): string {
		const baseName = t("map.controls.createNote.defaultName");

		let suffix = 0;
		let path = this.buildPath(folder, baseName, suffix);
		while (this.app.vault.getAbstractFileByPath(path)) {
			suffix += 1;
			path = this.buildPath(folder, baseName, suffix);
		}

		return path;
	}

	private buildPath(folder: TFolder, baseName: string, suffix: number): string {
		const name = suffix === 0 ? baseName : `${baseName} ${suffix}`;
		return folder.isRoot() ? `${name}.md` : `${folder.path}/${name}.md`;
	}
}
