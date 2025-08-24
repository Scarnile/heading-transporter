import { ItemView, WorkspaceLeaf } from "obsidian"

export const HEADING_SELECTOR_VIEW_TYPE = 'heading-selector-view'

export class HeadingSelectorView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return HEADING_SELECTOR_VIEW_TYPE
    }

    getDisplayText(): string {
        return 'Heading Selector View'
    }

    async onOpen() {
        const container = this.contentEl;
        container.empty();
        container.createEl('h4', { text: 'Heading Selector' });
    }

    async onClose() {
        
    }
}