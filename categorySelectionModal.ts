import { App, Notice, SuggestModal } from "obsidian";

import { HeadingCategory } from "headingCategory";
import HeadingTransporterPlugin from "main";

export class CategorySelectionModal extends SuggestModal<HeadingCategory> {

	plugin: HeadingTransporterPlugin;

	constructor(app: App, plugin: HeadingTransporterPlugin) {
		super(app);
		this.plugin = plugin
	}

	// Returns all available suggestions.
	getSuggestions(query: string): HeadingCategory[] {
		const categories = this.plugin.categoryManager.serialize()

		return categories.filter((category) =>
			category.name.toLowerCase().includes(query.toLowerCase())			
		);
	}

	// Renders each suggestion item.
	renderSuggestion(category: HeadingCategory, el: HTMLElement) {
		el.createEl('div', { text: category.name });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(category: HeadingCategory, evt: MouseEvent | KeyboardEvent) {
		new Notice(`Selected ${category.name}`);
	}
}

