import { PropertyRenderContext, PropertyWidgetComponentBase } from "obsidian-typings";
import { schemaValidatorFactory } from "./schemas";

export const markerProperty = {
	type: "marker",
	name: () => "Marker",
	icon: "lucide-map-pin",
	validate: validateMarkerPropertyValue,
	render: (element: HTMLElement, value: unknown, ctx: PropertyRenderContext) =>
		new MarkerPropertyWidgetComponent(element, value, ctx),
	reservedKeys: ["marker"],
};

function validateMarkerPropertyValue(propertyValue: unknown): boolean {
	const arrayValue = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
	if (arrayValue.some((element) => typeof element !== "object" || element === null)) return false;
	return arrayValue.every((element) => schemaValidatorFactory("marker")(element));
}

class MarkerPropertyWidgetComponent implements PropertyWidgetComponentBase {
	containerEl: HTMLElement;
	type = "marker";

	constructor(
		public element: HTMLElement,
		public value: unknown,
		public ctx: PropertyRenderContext,
	) {
		this.containerEl = element;
	}

	focus(): void {
		this.onFocus();
	}

	onFocus(): void {}

	setValue(value: unknown): void {
		this.ctx.onChange(value);
	}

	// TODO: Implement interactable HTML element
}
