import { App, Setting, TFile } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { MarkerEntry, MarkerModalMode } from "@plugin/types";
import { isNotNull } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { FileSuggest } from "./fileSuggest";
import { MarkerModal } from "./markerModal";

export class MarkerFileModal extends MarkerModal {
	private selectedFile: TFile | null;

	constructor(
		app: App,
		protected override onSubmit: (result: MarkerEntry) => void,
		mode: MarkerModalMode,
	) {
		super(app, onSubmit, undefined, mode);
	}

	override addSettings() {
		this.addFileSelectSetting();
		super.addSettings();

		this.confirmButton?.onClick(() => {
			if (SchemaValidator.marker(this.value) && isNotNull(this.selectedFile)) {
				this.close();
				this.onSubmit({
					...this.value,
					name: this.selectedFile.basename,
					link: this.selectedFile.path,
				});
			}
		});
	}

	private addFileSelectSetting(): void {
		new Setting(this.contentEl)
			.setName(t("modal.icon.title")) // TODO
			.setDesc(t("modal.icon.description")) // TODO
			.addSearch((searchField) => {
				searchField
					.setValue(this.value.icon ?? "")
					.setPlaceholder(t("modal.icon.placeholder")) // TODO
					.onChange((value) => (this.value.icon = value !== "" ? value : undefined));
				new FileSuggest(this.app, searchField);
			});
	}
}
