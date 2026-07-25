import { AbstractInputSuggest, App, SearchComponent, TFile } from "obsidian";

export class NoteSuggest extends AbstractInputSuggest<TFile> {
	constructor(
		app: App,
		private searchComponent: SearchComponent,
		private files: TFile[],
		private onSelectFile: (file: TFile) => void,
	) {
		super(app, searchComponent.inputEl);
	}

	protected getSuggestions(input: string): TFile[] {
		const lowerCaseInput = input.toLocaleLowerCase();
		return this.files.filter((file) => file.basename.toLocaleLowerCase().contains(lowerCaseInput));
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.createDiv({ text: file.basename });
	}

	override selectSuggestion(file: TFile, _evt: MouseEvent | KeyboardEvent): void {
		this.searchComponent.setValue(file.basename);
		this.onSelectFile(file);
		this.close();
	}
}
