import { App, Setting, TFile } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { MarkerModalMode, MarkerObject, NoteSelection } from "@plugin/types";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { MarkerModal } from "./markerModal";
import { NoteSuggest } from "./noteSuggest";

export class MarkerNoteModal extends MarkerModal<MarkerObject> {
	private noteSelection: NoteSelection = undefined;

	constructor(
		app: App,
		private onSubmitWithNote: (result: MarkerObject, noteSelection: NoteSelection) => void,
		initialValue: MarkerObject | undefined,
		mode: MarkerModalMode,
		private existingFiles: TFile[],
	) {
		super(app, () => {}, initialValue, mode);
	}

	override addSettings() {
		this.addNoteNameSetting();
		super.addSettings();

		this.confirmButton?.onClick(() => {
			if (SchemaValidator.marker(this.value)) {
				this.close();
				this.onSubmitWithNote(this.value, this.noteSelection);
			}
		});
	}

	private addNoteNameSetting(): void {
		new Setting(this.contentEl)
			.setName(t("modal.noteName.title"))
			.setDesc(t("modal.noteName.description"))
			.addSearch((searchField) => {
				searchField.onChange((value) => {
					this.noteSelection = value !== "" ? value : undefined;
				});
				new NoteSuggest(this.app, searchField, this.existingFiles, (file) => {
					this.noteSelection = file;
				});
			});
	}
}
