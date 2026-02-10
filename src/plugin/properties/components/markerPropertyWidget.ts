import {
	PropertyRenderContext,
	PropertyWidget,
	PropertyWidgetComponentBase,
} from "obsidian-typings";
import { SchemaValidator } from "plugin/properties/schemas";
import { MarkerObject } from "plugin/types";
import { MarkerValueComponent } from "./markerValue";
import { MarkerAddComponent } from "./markerAdd";
import { isNonEmptyObject } from "plugin/util";

export const markerWidget: PropertyWidget<MarkerPropertyWidgetComponent> = {
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

function validateMarkerPropertyValue(propertyValue: unknown): propertyValue is MarkerObject[] {
	const arrayValue = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
	if (arrayValue.some((element) => !isNonEmptyObject(element))) return false;
	return arrayValue.every((element) => SchemaValidator.marker(element));
}

class MarkerPropertyWidgetComponent implements PropertyWidgetComponentBase {
	containerEl: HTMLElement;
	type = "marker" as const;

	listComponent: HTMLUListElement;
	innerComponents: MarkerValueComponent[] = [];
	addComponent: MarkerAddComponent | undefined;

	constructor(
		public element: HTMLElement,
		public value: MarkerObject[],
		public ctx: PropertyRenderContext,
	) {
		this.containerEl = this.element.createDiv();

		this.listComponent = document.createElement("ul");
		this.listComponent.addClass("leaflet-map-property-tag-list");
		this.containerEl.appendChild(this.listComponent);

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

	private pushValue(markerObject: MarkerObject) {
		const copy = this.value.slice();
		copy.push(markerObject);
		this.setValue(copy);
	}

	private updateValueAtIndex(markerObject: MarkerObject, index: number) {
		// es2023 .toSplice() is not available so we copy, then splice
		const copy = this.value.slice();
		copy.splice(index, 1, markerObject);
		this.setValue(copy);
	}

	private removeValueAtIndex(index: number) {
		// es2023 .toSplice() is not available so we copy, then splice
		const copy = this.value.slice();
		copy.splice(index, 1);
		this.setValue(copy);
	}

	private updateChildren() {
		this.innerComponents.forEach((component) => component.unload());
		this.innerComponents = [];
		this.listComponent.replaceChildren();
		this.addComponent?.unload();

		for (const [index, markerObject] of this.value.entries()) {
			const tagEl = new MarkerValueComponent(this.ctx.app, this.listComponent, markerObject);
			tagEl.onChange((value) => this.updateValueAtIndex(value, index));
			tagEl.onDelete(() => this.removeValueAtIndex(index));
			this.innerComponents.push(tagEl);
		}

		this.addComponent = new MarkerAddComponent(this.ctx.app, this.listComponent);
		this.addComponent.onChange((value) => this.pushValue(value));
	}
}
