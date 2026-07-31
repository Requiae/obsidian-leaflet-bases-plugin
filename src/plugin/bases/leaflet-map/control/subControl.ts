import { DomEvent, DomUtil, LeafletMouseEvent } from "leaflet";
import { App } from "obsidian";
import { Map } from "@plugin/bases/leaflet-map/map/map";
import { ViewUtil } from "@plugin/bases/leaflet-map/viewUtil";
import { Constants as C } from "@plugin/constants";
import { RequiredMapObject } from "@plugin/types";

export interface SubControlOptions {
	index: number;
	map: Map;
	app: App;
	viewUtil: ViewUtil;
	onSelectCallback: (index: number) => void;
}

export class SubControl {
	readonly index: number;
	readonly map: Map;
	protected readonly app: App;
	protected readonly viewUtil: ViewUtil;

	private onSelectCallback: (index: number) => void = () => {};
	protected refreshCallback: () => void = () => {};
	protected button: HTMLButtonElement | undefined;
	protected options: RequiredMapObject = {
		...C.map.default,
		defaultZoom: C.map.default.minZoom,
		image: "",
	};

	private _isSelected: boolean = false;
	get isSelected(): boolean {
		return this._isSelected;
	}

	constructor(options: SubControlOptions) {
		this.index = options.index;
		this.map = options.map;
		this.app = options.app;
		this.viewUtil = options.viewUtil;
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

	updateSettings(options: RequiredMapObject): void {
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
