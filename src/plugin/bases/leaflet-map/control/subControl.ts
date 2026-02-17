import { DomEvent, DomUtil, LeafletMouseEvent, Map } from "leaflet";
import { MapObject } from "plugin/types";

interface SubControlOptions {
	index: number;
	map: Map;
	onSelectCallback: (index: number) => void;
}

export class SubControl {
	readonly index: number;
	readonly map: Map;

	private onSelectCallback: (index: number) => void = () => {};
	protected button: HTMLButtonElement | undefined;
	protected options: MapObject;

	private _isSelected: boolean = false;
	get isSelected(): boolean {
		return this._isSelected;
	}

	constructor(options: SubControlOptions) {
		this.index = options.index;
		this.map = options.map;
		this.onSelectCallback = options.onSelectCallback;
	}

	setSelected(isSelected: boolean): void {
		if (this._isSelected === isSelected) return;

		this._isSelected = isSelected;
		if (isSelected) {
			this.button?.addClass("selected");
			this.onSelected();
		} else {
			this.button?.removeClass("selected");
			this.onDeselected();
		}
	}

	onAdd(containerEl: HTMLElement): void {
		this.button = DomUtil.create("button", "leaflet-control-button", containerEl);
		this.button.addEventListener("click", () => this.onSelectCallback(this.index));
		DomEvent.disableClickPropagation(containerEl);
		this.onAdded();
	}

	onRemove(): void {
		this.onRemoved();
		this.button?.removeEventListener("click", () => {});
		this.button?.replaceChildren();
	}

	updateSettings(options: MapObject): void {
		this.options = { ...this.options, ...options };
	}

	protected onAdded(): void {
		throw new Error("Not implemented");
	}

	protected onRemoved(): void {}
	protected onSelected(): void {}
	protected onDeselected(): void {}

	mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}
}
