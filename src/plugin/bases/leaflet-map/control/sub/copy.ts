import { LeafletMouseEvent } from "leaflet";
import { SubControl } from "../subControl";

export class CopyControl extends SubControl {
	onAdd(_containerEl: HTMLElement): void {
		throw new Error("Not implemented");
	}

	mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}
}
