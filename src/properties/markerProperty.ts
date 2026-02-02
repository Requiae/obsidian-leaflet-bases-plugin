import {
	PropertyRenderContext,
	PropertyWidget,
	PropertyWidgetComponentBase,
} from "obsidian-typings";
import { schemaValidatorFactory } from "./schemas";
import { ValueComponent } from "obsidian";
import { MarkerObject } from "plugin/types";
import { getIconWithDefault } from "plugin/util";

export const markerProperty: PropertyWidget<MarkerPropertyWidgetComponent> = {
	type: "marker",
	name: () => "Marker",
	icon: "lucide-map-pin",
	validate: validateMarkerPropertyValue,
	render: (element: HTMLElement, value: unknown, ctx: PropertyRenderContext) =>
		new MarkerPropertyWidgetComponent(
			element,
			validateMarkerPropertyValue(value) ? value : [],
			ctx,
		),
	reservedKeys: ["marker"],
};

const markerValidator = schemaValidatorFactory("marker");

function validateMarkerPropertyValue(propertyValue: unknown): propertyValue is MarkerObject[] {
	const arrayValue = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
	if (arrayValue.some((element) => typeof element !== "object" || element === null)) return false;
	return arrayValue.every((element) => markerValidator(element));
}

class MarkerPropertyWidgetComponent implements PropertyWidgetComponentBase {
	containerEl: HTMLElement;
	type = "marker" as const;

	listComponent: HTMLUListElement;
	innerComponents: MarkerComponent[] = [];

	constructor(
		public element: HTMLElement,
		public value: MarkerObject[],
		public ctx: PropertyRenderContext,
	) {
		this.listComponent = document.createElement("ul");
		this.listComponent.addClass("leaflet-map-property-tag-list");
		element.appendChild(this.listComponent);

		this.updateChildren();
	}

	focus(): void {
		this.onFocus();
	}

	onFocus(): void {}

	setValue(value: unknown): void {
		if (!validateMarkerPropertyValue(value)) return;
		this.value = value;
		this.ctx.onChange(value);

		this.updateChildren();
	}

	updateValueAtIndex(markerObject: MarkerObject, index: number) {
		// es2023 .toSplice() is not available so we copy, then splice
		const copy = this.value.slice();
		copy.splice(index, 1, markerObject);
		this.setValue(copy);
	}

	removeValueAtIndex(index: number) {
		// es2023 .toSplice() is not available so we copy, then splice
		const copy = this.value.slice();
		copy.splice(index, 1);
		this.setValue(copy);
	}

	updateChildren() {
		this.innerComponents.forEach((component) => component.unload());
		this.innerComponents = [];
		this.listComponent.replaceChildren();

		for (const [index, markerObject] of this.value.entries()) {
			const tagEl = new MarkerComponent(this.listComponent);
			tagEl.setValue(markerObject);
			tagEl.onChange((value) => this.updateValueAtIndex(value, index));
			tagEl.onDelete(() => this.removeValueAtIndex(index));
			this.innerComponents.push(tagEl);
		}
	}
}

class MarkerComponent extends ValueComponent<MarkerObject> {
	private value: MarkerObject;

	iconEl: HTMLDivElement;
	tagEl: HTMLLIElement;
	textEl: HTMLDivElement;

	componentsContainerEl: HTMLElement;

	onChangeCallback: (value: MarkerObject) => void = () => {};
	onDeleteCallback: () => void = () => {};

	constructor(containerEl: HTMLElement) {
		super();

		this.tagEl = document.createElement("li");
		this.tagEl.addClass("leaflet-map-property-tag-item");

		// TODO: set colour to marker colour
		this.tagEl.setCssStyles({ background: "#21409a" });

		this.iconEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-icon" });
		this.textEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-text" });
		const closeEl = this.tagEl.createDiv({ cls: "leaflet-map-property-tag-item-close" });

		this.tagEl.onClickEvent((event) => {
			event.stopPropagation();
			//console.log("modal");
			// TODO: the whole modal thing

			//this.setValue(newValue);
			this.onChanged();
		});
		closeEl.onClickEvent((event) => {
			event.stopPropagation();
			this.onDeleted();
		});

		containerEl.appendChild(this.tagEl);
	}

	unload() {
		this.onChange(() => {});
	}

	getValue(): MarkerObject {
		return this.value;
	}

	setValue(value: MarkerObject): this {
		this.value = value;
		this.iconEl.replaceChildren(getIconWithDefault(value.icon));
		this.textEl.textContent = `${value.mapName}: ${value.coordinates.toString()}`;

		return this;
	}

	onChanged() {
		this.onChangeCallback(this.getValue());
	}

	onChange(cb: (value: MarkerObject) => void): this {
		this.onChangeCallback = cb;
		return this;
	}

	onDeleted() {
		this.onDeleteCallback();
	}

	onDelete(cb: () => void): this {
		this.onDeleteCallback = cb;
		return this;
	}
}
