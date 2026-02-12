import { LeafletMouseEvent, Map } from "leaflet";

interface SubControlOptions {
	index: number;
	map: Map;
}

export class SubControl {
	readonly index: number;
	readonly map: Map;

	protected onSelectCallback: (index: number, isSelected: boolean) => void = () => {};
	protected button: HTMLButtonElement | undefined;

	private _isSelected: boolean = false;
	get isSelected(): boolean {
		return this._isSelected;
	}

	constructor(options: SubControlOptions) {
		this.index = options.index;
		this.map = options.map;
	}

	onSelect(cb: (index: number, isSelected: boolean) => void): this {
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

	onAdd(_containerEl: HTMLElement): void {
		throw new Error("Not implemented");
	}

	onRemove(): void {}

	mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}
}
