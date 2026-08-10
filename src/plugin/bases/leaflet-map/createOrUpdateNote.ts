import { App, TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { Frontmatter } from "@plugin/properties/frontmatter";
import { MarkerObject, NoteSelection } from "@plugin/types";
import { ViewUtil } from "./viewUtil";

export function createOrUpdateNote(
	app: App,
	viewUtil: ViewUtil,
	marker: MarkerObject,
	noteSelection: NoteSelection,
): void {
	if (noteSelection instanceof TFile) {
		new Frontmatter(app).addMarkerToFile(noteSelection, marker);
		return;
	}

	void viewUtil.createFileForView({ [C.property.marker.identifier]: [marker] }, noteSelection);
}
