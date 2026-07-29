import { App, Setting } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { MarkerEntry, MarkerModalMode, MarkerObject, SimpleTFile } from "@plugin/types";
import { isNotNull } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { FileSuggest } from "./fileSuggest";
import { MarkerModal } from "./markerModal";

export class MarkerFileModal<T extends MarkerEntry> extends MarkerModal<T> {
	private selectedFile: SimpleTFile | null = null;

	constructor(
		app: App,
		protected override onSubmit: (result: MarkerEntry) => void,
		initialValue: MarkerObject | undefined,
		mode: MarkerModalMode,
	) {
		super(app, onSubmit, initialValue, mode);
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
					.setPlaceholder(t("modal.icon.placeholder")) // TODO
					.onChange(
						(value) => (this.selectedFile = value !== "" ? { basename: value, path: "" } : null),
					);
				new FileSuggest(this.app, searchField, (file) => (this.selectedFile = file));
			});
	}
}
