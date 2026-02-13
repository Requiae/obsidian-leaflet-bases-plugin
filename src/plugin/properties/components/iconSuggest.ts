import { AbstractInputSuggest, App, IconName, SearchComponent, getIconIds } from "obsidian";

export class IconSuggest extends AbstractInputSuggest<string> {
	private content: IconName[];

	constructor(
		app: App,
		private searchComponent: SearchComponent,
	) {
		super(app, searchComponent.inputEl);
		this.content = getIconIds();
	}

	protected getSuggestions(input: string): string[] {
		const lowerCaseInput = input.toLocaleLowerCase();
		return this.content.filter((content) => content.toLocaleLowerCase().contains(lowerCaseInput));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.setText(value);
	}

	override selectSuggestion(value: string, _evt: MouseEvent | KeyboardEvent): void {
		this.searchComponent.setValue(value).onChanged();
		this.close();
	}
}
