import { LeafletMouseEvent } from "leaflet";
import { SubControl } from "../subControl";

export class CopyControl extends SubControl {
	override onAdded(): void {
		throw new Error("Not implemented");
	}

	override mapClicked(_event: LeafletMouseEvent): void {
		throw new Error("Not implemented");
	}
}
