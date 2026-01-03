import { App, Notice, SuggestModal } from "obsidian";
import { HeadingCategory, HeadingCategoryManager } from "headingCategory";

import HeadingTransporterPlugin from "main";
import { PluginContext } from "heading";

export class CategorySelectionModal extends SuggestModal<HeadingCategory> {

	headingId: string
	plugin: HeadingTransporterPlugin
	categoryManager: HeadingCategoryManager

	constructor(headingId: string, pluginContext: PluginContext) {
		super(pluginContext.app)
		this.headingId = headingId
		this.plugin = pluginContext.plugin
		this.categoryManager = pluginContext.plugin.categoryManager
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
		this.categoryManager.addHeadingToCategory(this.headingId, category)
		this.plugin.settings.headingInfos = this.plugin.headingManager.getAllHeadings()
		this.plugin.saveSettings()
		this.plugin.headingSelectorView.display()
	}
}

