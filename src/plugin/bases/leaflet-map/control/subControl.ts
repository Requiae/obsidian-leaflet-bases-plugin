import { DomEvent, DomUtil, LeafletMouseEvent, Map } from "leaflet";

interface SubControlOptions {
	index: number;
	map: Map;
}

export class SubControl {
	readonly index: number;
	readonly map: Map;

	private onSelectCallback: (index: number) => void = () => {};
	protected button: HTMLButtonElement | undefined;

	private _isSelected: boolean = false;
	get isSelected(): boolean {
		return this._isSelected;
	}

	constructor(options: SubControlOptions) {
		this.index = options.index;
		this.map = options.map;
	}

	onSelect(cb: (index: number) => void): this {
		this.onSelectCallback = cb;
		return this;
	}

	setSelected(isSelected: boolean): void {
		if (this._isSelected === isSelected) return;

		this._isSelected = isSelected;
		if (isSelected) {
			this.button?.addClass("selected");
		} else {
			this.button?.removeClass("selected");
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

	protected onAdded(): void {
		throw new Error("Not implemented");
	}

	protected onRemoved(): void {}

	mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}
}
