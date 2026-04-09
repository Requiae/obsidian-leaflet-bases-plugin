import { App, ColorComponent, DropdownComponent, Modal, Setting } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerModalMode, MarkerObject } from "@plugin/types";
import { SchemaValidator } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";
import { IconSuggest } from "./iconSuggest";
import { MarkerModalErrorComponent } from "./markerModalErrorComponent";

function buildColourOptionsObject(): Record<string, string> {
	return Object.fromEntries(
		Object.entries(C.property.predefinedColours).map(([key, value]) => [
			key,
			t(`modal.colour.predefined.${value}`),
		]),
	);
}

export class MarkerModal extends Modal {
	private value: Partial<MarkerObject>;
	private submitEnabledCallback: (isEnabled: boolean) => void = () => {};

	constructor(
		app: App,
		onSubmit: (result: MarkerObject) => void,
		initialValue: MarkerObject | undefined,
		mode: MarkerModalMode,
	) {
		super(app);
		this.setTitle(t(`modal.title.${mode}`));

		this.value = initialValue ?? {};
		const coordinatesValidator = Validator.coordinates;

		new Setting(this.contentEl)
			.setName(t("modal.mapName.title"))
			.setDesc(t("modal.mapName.description"))
			.addText((textField) => {
				textField
					.setValue(this.value.mapName ?? "")
					.onChange((value) => (this.value.mapName = value !== "" ? value : undefined));
			});

		let coordinatesError: MarkerModalErrorComponent;
		new Setting(this.contentEl)
			.setName(t("modal.coordinates.title"))
			.setDesc(t("modal.coordinates.description"))
			.setClass("bases-leaflet-view-setting-vertical")
			.addText((textField) => {
				textField.setValue(this.value.coordinates ?? "").onChange((value) => {
					if (value === "") {
						coordinatesError.setMessage(t("modal.coordinates.error.required"));
						this.submitEnabledCallback(false);
					} else if (!coordinatesValidator(value)) {
						coordinatesError.setMessage(t("modal.coordinates.error.invalid"));
						this.submitEnabledCallback(false);
					} else {
						coordinatesError.setMessage("");
						this.submitEnabledCallback(true);
						this.value.coordinates = value;
					}

					textField.inputEl.reportValidity();
				});
			})
			.addComponent((errorEl) => {
				coordinatesError = new MarkerModalErrorComponent(errorEl).setMessage("");
				return coordinatesError;
			});

		new Setting(this.contentEl)
			.setName(t("modal.icon.title"))
			.setDesc(t("modal.icon.description"))
			.addSearch((searchField) => {
				searchField
					.setValue(this.value.icon ?? "")
					.setPlaceholder(t("modal.icon.placeholder"))
					.onChange((value) => (this.value.icon = value !== "" ? value : undefined));
				new IconSuggest(app, searchField);
			});

		let colourComponent: ColorComponent;
		let dropdownComponent: DropdownComponent;
		new Setting(this.contentEl)
			.setName(t("modal.colour.title"))
			.setDesc(t("modal.colour.description"))
			.addColorPicker((colourField) => {
				colourComponent = colourField;
				colourField.setValue(this.value.colour ?? C.marker.defaultColour).onChange((value) => {
					if (Validator.colour(value)) {
						this.value.colour = value;
						dropdownComponent.setValue(value);
					}
				});
			})
			.addDropdown((dropdownField) => {
				dropdownComponent = dropdownField;
				dropdownField
					.addOptions(buildColourOptionsObject())
					.setValue(this.value.colour ?? C.marker.defaultColour)
					.onChange((value) => {
						if (Validator.colour(value)) {
							this.value.colour = value;
							colourComponent.setValue(value);
						}
					});
			});

		new Setting(this.contentEl)
			.setName(t("modal.minZoom.title"))
			.setDesc(t("modal.minZoom.description"))
			.addText((textField) => {
				textField.inputEl.type = "number";
				textField
					.setValue(this.value.minZoom?.toString() ?? "")
					.onChange((value) => (this.value.minZoom = value !== "" ? Number(value) : undefined));
			});

		new Setting(this.contentEl).addButton((button) => {
			button
				.setButtonText(t(`modal.submit.${mode}`))
				.setCta()
				.onClick(() => {
					if (SchemaValidator.marker(this.value)) {
						this.close();
						onSubmit(this.value);
					}
				});
			this.setSubmitEnabledCallback((isEnabled) => {
				button.setDisabled(!isEnabled);
			});
		});
	}

	private setSubmitEnabledCallback(cb: (isEnabled: boolean) => void): void {
		this.submitEnabledCallback = cb;
	}
}
