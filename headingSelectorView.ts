import { HeadingTransporterSettings } from "main";
import { ItemView, Setting, WorkspaceLeaf } from "obsidian"

export const HEADING_SELECTOR_VIEW_TYPE = 'heading-selector-view'

export class HeadingSelectorView extends ItemView {

    settings: HeadingTransporterSettings

    constructor(leaf: WorkspaceLeaf, settings: HeadingTransporterSettings) {
        super(leaf);
        this.settings = settings;
    }
    

    getViewType(): string {
        return HEADING_SELECTOR_VIEW_TYPE
    }

    getDisplayText(): string {
        return 'Heading Selector View'
    }

    async onOpen() {
        // this.display()
        console.log("onOpen")
    }

    async onClose() {
        console.log("onClose")
        
    }

    async display() {
        const container = this.contentEl;
        container.empty();
        
        container.createEl('h4', { text: 'Heading Selector' });
        
        for (let index = 0; index < this.settings.HeadingInfos.length; index++) {
            container.createEl('h4', { text: this.settings.HeadingInfos[index].headingName});
        }
    }
}