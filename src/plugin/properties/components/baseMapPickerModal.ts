import { App, FuzzySuggestModal } from "obsidian";
import { t } from "@plugin/i18n/locale";
import { MapCandidate } from "./mapCandidates";

export class BaseMapPickerModal extends FuzzySuggestModal<MapCandidate> {
	constructor(
		app: App,
		private candidates: MapCandidate[],
		private onChoose: (candidate: MapCandidate) => void,
	) {
		super(app);
		this.setPlaceholder(t("marker.picker.baseModal.placeholder"));
	}

	getItems(): MapCandidate[] {
		return this.candidates;
	}

	getItemText(candidate: MapCandidate): string {
		const mapName = candidate.settings.name;
		const base = `${candidate.file.basename} — ${candidate.viewName}`;
		return mapName ? `${base} (${mapName})` : base;
	}

	onChooseItem(candidate: MapCandidate): void {
		this.onChoose(candidate);
	}
}
