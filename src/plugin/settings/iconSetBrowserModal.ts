import { App, ButtonComponent, Modal, Notice, Setting } from "obsidian";
import { Constants as C } from "@plugin/constants";
import {
	CollectionEntry,
	filterCollectionEntries,
	getIconifyCollections,
	getIconifyIconSet,
	toCollectionEntries,
} from "@plugin/icons/iconifyApi";
import { IconManager } from "@plugin/icons/iconManager";
import { t } from "@plugin/i18n/locale";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { SettingsManager } from "./settingsManager";

const MAX_PREVIEW_ICONS = 6;

export class IconSetBrowserModal extends Modal {
	private listEl: HTMLElement | undefined;
	private allEntries: CollectionEntry[] = [];
	private query: string = "";

	constructor(
		app: App,
		private settingsManager: SettingsManager,
		private iconManager: IconManager,
		private onIconSetAdded: () => void,
	) {
		super(app);
		this.setTitle(t("settings.icons.browse.title"));
		this.modalEl.addClass("bases-leaflet-view-icon-browser-modal");
	}

	override onOpen(): void {
		new Setting(this.contentEl).addSearch((searchField) => {
			searchField.setPlaceholder(t("settings.icons.browse.searchPlaceholder")).onChange((value) => {
				this.query = value;
				this.renderList();
			});
		});

		this.listEl = this.contentEl.createDiv({ cls: "setting-items bases-leaflet-view-icon-browser-list" });
		void this.loadCollections();
	}

	override onClose(): void {
		this.contentEl.empty();
	}

	private async loadCollections(): Promise<void> {
		this.setStatus(t("settings.icons.browse.loading"));

		const collections = await getIconifyCollections();
		if (!collections) {
			this.setStatus(t("settings.icons.browse.loadError"), true);
			return;
		}

		this.allEntries = toCollectionEntries(collections).sort((a, b) => a.info.name.localeCompare(b.info.name));
		this.renderList();
	}

	private setStatus(message: string, withRetry: boolean = false): void {
		if (!this.listEl) return;

		this.listEl.replaceChildren();
		this.listEl.createDiv({ cls: "bases-leaflet-view-icon-browser-status", text: message });
		if (withRetry) {
			new Setting(this.listEl).addButton((button) =>
				button.setButtonText(t("settings.icons.browse.retry")).onClick(() => void this.loadCollections()),
			);
		}
	}

	private renderList(): void {
		if (!this.listEl) return;

		const addedPrefixes = new Set(this.settingsManager.settings.iconData.map((set) => set.prefix));
		const matches = filterCollectionEntries(this.allEntries, this.query);

		this.listEl.replaceChildren();
		if (matches.length === 0) {
			this.setStatus(t("settings.icons.browse.empty"));
			return;
		}

		for (const entry of matches) {
			this.buildRow(entry, addedPrefixes.has(entry.prefix));
		}
	}

	private buildRow(entry: CollectionEntry, isAdded: boolean): void {
		if (!this.listEl) return;

		const row = this.listEl.createDiv({ cls: "setting-item" });
		row.createDiv({ cls: "setting-item-info" }, (info) => {
			info.createDiv({ cls: "setting-item-name" }, (name) => {
				name.createEl("a", {
					text: entry.info.name,
					href: `${C.settings.links.preview}${entry.prefix}/`,
				});
			});
			info.createDiv({
				text: [
					entry.prefix,
					entry.info.total !== undefined ? `${entry.info.total} icons` : undefined,
					entry.info.license.title,
					entry.info.author.name,
				]
					.filter((value) => value !== undefined)
					.join(" • "),
				cls: "setting-item-description",
			});
			this.buildPreview(info, entry);
		});
		row.createDiv({ cls: "setting-item-control" }, (control) => {
			const button = new ButtonComponent(control)
				.setButtonText(
					isAdded ? t("settings.icons.browse.addedButtonText") : t("settings.icons.browse.addButtonText"),
				)
				.setDisabled(isAdded);
			button.onClick(() => void this.addIconSet(entry, button));
		});
	}

	private buildPreview(container: HTMLElement, entry: CollectionEntry): void {
		const samples = entry.info.samples?.slice(0, MAX_PREVIEW_ICONS);
		if (!samples || samples.length === 0) return;

		container.createDiv({ cls: "bases-leaflet-view-icon-browser-preview" }, (preview) => {
			for (const sample of samples) {
				preview.createEl("img", {
					attr: {
						src: `${C.settings.iconify.apiBaseUrl}/${entry.prefix}/${sample}.svg`,
						alt: sample,
					},
				});
			}
		});
	}

	private async addIconSet(entry: CollectionEntry, button: ButtonComponent): Promise<void> {
		button.setDisabled(true);

		let added = false;
		await this.iconManager.reload(async () => {
			const json = await getIconifyIconSet(entry.prefix);
			if (json && SchemaValidator.icon(json)) {
				const data = this.settingsManager.settings.iconData.slice();
				data.push(json);
				await this.settingsManager.updateSettings({ iconData: data });
				added = true;
			} else {
				console.error(`Icon set "${entry.prefix}" failed validation`, json);
				new Notice(t("settings.icons.browse.addError"));
			}
		});

		if (!added) {
			button.setDisabled(false);
			return;
		}

		this.onIconSetAdded();
		this.renderList();
	}
}
