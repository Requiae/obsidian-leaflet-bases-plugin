import { AbstractInputSuggest, App, SearchComponent } from "obsidian";
import { SimpleTFile } from "@plugin/types";

export class FileSuggest extends AbstractInputSuggest<SimpleTFile> {
	private content: SimpleTFile[] = [];

	constructor(
		app: App,
		private searchComponent: SearchComponent,
		private setSelection: (file: SimpleTFile) => void,
	) {
		super(app, searchComponent.inputEl);
		this.content = app.vault
			.getMarkdownFiles()
			.map((file) => ({ basename: file.basename, path: file.path }));
	}

	protected override getSuggestions(input: string): SimpleTFile[] | Promise<SimpleTFile[]> {
		const lowerCaseInput = input.toLocaleLowerCase();
		const suggestions = this.content.filter(
			(content) =>
				content.basename.toLocaleLowerCase().contains(lowerCaseInput) ||
				content.path.toLocaleLowerCase().contains(lowerCaseInput),
		);

		return suggestions;
	}

	override renderSuggestion(value: SimpleTFile, el: HTMLElement): void {
		el.createDiv({ text: value.basename });
		// TODO: Make look like file suggest when making a [[link]]
	}

	override selectSuggestion(value: SimpleTFile, _evt: MouseEvent | KeyboardEvent): void {
		this.searchComponent.setValue(value.basename);
		this.setSelection(value);
		this.close();
	}
}
