import { Control, DomUtil, Map } from "leaflet";
import { CopyControl, MeasureControl, PanControl } from "./sub";
import { SubControl } from "./subControl";

export class ControlContainer extends Control {
	// Do not remove individual elements, each element has a ref to it's own index
	private controls: SubControl[] = [];

	constructor() {
		super({ position: "topleft" });
	}

	override onAdd(map: Map): HTMLElement {
		this.registerSubControl(PanControl, map);
		this.registerSubControl(MeasureControl, map);
		this.registerSubControl(CopyControl, map);

		const containerEl = DomUtil.create("div", "leaflet-bar leaflet-control");

		this.controls.forEach((control) => control.onAdd(containerEl));
		this.controls[0]?.setSelected(true);

		map.on("click", (event) =>
			this.controls.forEach((control) => {
				if (control.isSelected) control.mapClicked(event);
			}),
		);

		return containerEl;
	}

	override onRemove(map: Map | undefined): void {
		map?.removeEventListener("click");

		this.controls.forEach((control) => control.onRemove());
		this.controls = [];
	}

	private registerSubControl(control: typeof SubControl, map: Map): void {
		const onSelectCallback = (controlIndex: number) => {
			this.controls.forEach((control, loopIndex) =>
				control.setSelected(loopIndex === controlIndex),
			);
		};
		const options = { index: this.controls.length, map, onSelectCallback };
		this.controls.push(new control(options));
	}
}
