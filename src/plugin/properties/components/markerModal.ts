import {
	AbstractInputSuggest,
	App,
	ColorComponent,
	DropdownComponent,
	getIconIds,
	IconName,
	Modal,
	Setting,
} from "obsidian";
import { Constants as C } from "plugin/constants";
import { MarkerObject } from "plugin/types";
import { Validator } from "../validators";

export class MarkerModal extends Modal {
	private value: MarkerObject;
	private submitEnabledCallback: (isEnabled: boolean) => void = () => {};

	constructor(app: App, onSubmit: (result: MarkerObject) => void, initialValue?: MarkerObject) {
		super(app);
		this.setTitle("Edit marker");

		this.value = initialValue ?? { coordinates: "-1, -1" };
		const coordinatesValidator = Validator.coordinates;

		new Setting(this.contentEl)
			.setName("Map name")
			.setDesc(
				"Optional. Name of the map this marker is specific to, useful if you want to add this note as a marker to multiple different maps.",
			)
			.addText((textField) => {
				textField
					.setValue(this.value.mapName ?? "")
					.onChange((value) => (this.value.icon = value !== "" ? value : undefined));
			});

		// TODO: Add validation visibility, warning disappears on blur now
		new Setting(this.contentEl)
			.setName("Coordinates")
			.setDesc("Required. Marker coordinates on the map.")
			.addText((textField) => {
				textField.setValue(this.value.coordinates).onChange((value) => {
					if (value === "") {
						textField.inputEl.setCustomValidity("Value is required");
						this.submitEnabledCallback(false);
					} else if (!coordinatesValidator(value)) {
						textField.inputEl.setCustomValidity("Value not a valid coordinate");
						this.submitEnabledCallback(false);
					} else {
						textField.inputEl.setCustomValidity("");
						this.submitEnabledCallback(true);
					}

					textField.inputEl.reportValidity();
				});
			});

		new Setting(this.contentEl)
			.setName("Icon")
			.setDesc("Optional. The marker icon, defaults to a dot if left empty.")
			.addSearch((searchField) => {
				searchField
					.setValue(this.value.icon ?? "")
					.setPlaceholder("Search for an icon")
					.onChange((value) => (this.value.icon = value !== "" ? value : undefined));
				new IconSuggest(app, searchField.inputEl);
			});

		let colourComponent: ColorComponent;
		let dropdownComponent: DropdownComponent;
		new Setting(this.contentEl)
			.setName("Colour")
			.setDesc(
				"The marker colour. The dropdown menu has some default values, on custom values it is empty.",
			)
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
					.addOptions(C.property.predefinedColours)
					.setValue(this.value.colour ?? C.marker.defaultColour)
					.onChange((value) => {
						if (Validator.colour(value)) {
							this.value.colour = value;
							colourComponent.setValue(value);
						}
					});
			});

		new Setting(this.contentEl)
			.setName("Minimal zoom")
			.setDesc("Optional. Minimal zoom from which the marker becomes visible.")
			.addText((textField) => {
				textField.inputEl.type = "number";
				textField
					.setValue(this.value.minZoom?.toString() ?? "")
					.onChange((value) => (this.value.minZoom = value !== "" ? Number(value) : undefined));
			});

		new Setting(this.contentEl).addButton((button) => {
			button
				.setButtonText("Submit changes")
				.setCta()
				.onClick(() => {
					this.close();
					onSubmit(this.value);
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

class IconSuggest extends AbstractInputSuggest<string> {
	private content: IconName[];

	constructor(
		app: App,
		private inputEl: HTMLInputElement,
	) {
		super(app, inputEl);
		this.content = getIconIds();
	}

	protected getSuggestions(input: string): string[] {
		const lowerCaseInput = input.toLocaleLowerCase();
		return this.content.filter((content) => content.toLocaleLowerCase().contains(lowerCaseInput));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.setText(value);
	}

	selectSuggestion(value: string, _evt: MouseEvent | KeyboardEvent): void {
		this.inputEl.value = value;
		this.inputEl.blur();
		this.close();
	}
}
