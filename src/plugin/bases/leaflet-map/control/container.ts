import { Control, DomUtil, Map as LeafletMap } from "leaflet";
import { Map } from "@plugin/bases/leaflet-map/map/map";
import { ViewUtil } from "@plugin/bases/leaflet-map/viewUtil";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import { RequiredMapObject } from "@plugin/types";
import { CreateNoteControl, MeasureControl, PanControl } from "./sub";
import { DragControl } from "./sub/drag";
import { SubControl } from "./subControl";

export class ControlContainer extends Control {
	// Do not remove individual elements, each element has a ref to it's own index
	private controls: SubControl[] = [];
	private activeIndex: number = 0;

	constructor(
		private plugin: BasesLeafletViewPlugin,
		private viewUtil: ViewUtil,
	) {
		super({ position: "topleft" });
	}

	override onAdd(map: Map): HTMLElement {
		this.registerSubControl(PanControl, map);

		const pluginSettings = this.plugin.settingsManager.settings;
		if (pluginSettings.enableMeasureTool) this.registerSubControl(MeasureControl, map);
		if (pluginSettings.enableDragTool) this.registerSubControl(DragControl, map);
		if (pluginSettings.enableCreateNoteTool) this.registerSubControl(CreateNoteControl, map);

		const containerEl = DomUtil.create("div", "leaflet-bar leaflet-control");

		this.controls.forEach((control) => control.onAdd(containerEl));
		this.controls[this.activeIndex]?.setSelected(true);

		map.on("click", (event) =>
			this.controls.forEach((control) => {
				if (control.isSelected) control.mapClicked(event);
			}),
		);

		return containerEl;
	}

	override onRemove(map: LeafletMap | undefined): void {
		map?.removeEventListener("click");

		this.controls.forEach((control) => control.onRemove());
		this.controls = [];
	}

	updateSettings(options: RequiredMapObject): void {
		this.controls.forEach((control) => control.updateSettings(options));
	}

	private registerSubControl(control: typeof SubControl, map: Map): void {
		const onSelectCallback = (controlIndex: number) => {
			this.controls.at(this.activeIndex)?.setSelected(false);
			this.controls.at(controlIndex)?.setSelected(true);
			this.activeIndex = controlIndex;
		};
		const options = {
			index: this.controls.length,
			map,
			plugin: this.plugin,
			viewUtil: this.viewUtil,
			onSelectCallback,
		};
		this.controls.push(new control(options));
	}
}
