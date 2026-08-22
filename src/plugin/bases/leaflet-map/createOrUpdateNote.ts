import { TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { BasesLeafletViewPlugin } from "@plugin/plugin";
import { Frontmatter } from "@plugin/properties/frontmatter";
import { MarkerObject, NoteSelection } from "@plugin/types";
import { ViewUtil } from "./viewUtil";

export function createOrUpdateNote(
	plugin: BasesLeafletViewPlugin,
	viewUtil: ViewUtil,
	marker: MarkerObject,
	noteSelection: NoteSelection,
): void {
	if (noteSelection instanceof TFile) {
		new Frontmatter(plugin.app, plugin.settingsManager).addMarkerToFile(noteSelection, marker);
		return;
	}

	void viewUtil.createFileForView({ [C.property.marker.type]: [marker] }, noteSelection);
}
