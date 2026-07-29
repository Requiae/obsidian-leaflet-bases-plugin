import { App, Notice } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { BaseMapPickerModal } from "./baseMapPickerModal";
import { findLeafletMapCandidates, openMapCandidate } from "./mapCandidates";

export async function openMatchingMap(app: App, mapName: string | undefined): Promise<void> {
	const candidates = await findLeafletMapCandidates(app);
	const matches = mapName
		? candidates.filter((candidate) => candidate.settings.name === mapName)
		: candidates;

	if (matches.length === 0) {
		new Notice(t(mapName ? "marker.picker.notice.noMatchingMap" : "marker.picker.notice.noMaps"));
		return;
	}

	const [onlyMatch] = matches;
	if (matches.length === 1 && onlyMatch) {
		await openMapCandidate(app, onlyMatch);
		return;
	}

	new BaseMapPickerModal(app, matches, (candidate) => void openMapCandidate(app, candidate)).open();
}
