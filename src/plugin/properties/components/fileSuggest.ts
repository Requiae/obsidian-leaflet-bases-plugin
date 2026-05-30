import { AbstractInputSuggest, App, SearchComponent } from "obsidian";

interface SimpleTFile {
	basename: string;
	path: string;
}

export class FileSuggest extends AbstractInputSuggest<SimpleTFile> {
	private content: SimpleTFile[] = [];

	constructor(
		app: App,
		private searchComponent: SearchComponent,
	) {
		super(app, searchComponent.inputEl);
		this.content = app.vault.getFiles().reduce<SimpleTFile[]>((filtered, file) => {
			if (file.extension === "md") {
				filtered.push({ basename: file.basename, path: file.path });
			}
			return filtered;
		}, []);
	}

	protected override getSuggestions(input: string): SimpleTFile[] | Promise<SimpleTFile[]> {
		const lowerCaseInput = input.toLocaleLowerCase();
		return this.content.filter((content) =>
			content.basename.toLocaleLowerCase().contains(lowerCaseInput),
		);
	}

	override renderSuggestion(value: SimpleTFile, el: HTMLElement): void {
		el.createDiv({ text: value.basename });
		// TODO: Make look like file suggest when making a [[link]]
	}

	override selectSuggestion(value: SimpleTFile, _evt: MouseEvent | KeyboardEvent): void {
		this.searchComponent.setValue(value.basename).onChanged();
		this.close();
	}
}
