import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";
import { ItemView, Setting, WorkspaceLeaf } from "obsidian"

export const HEADING_SELECTOR_VIEW_TYPE = 'heading-selector-view'

export class HeadingSelectorView extends ItemView {

    plugin: HeadingTransporterPlugin
    settings: HeadingTransporterSettings


    constructor(leaf: WorkspaceLeaf, plugin: HeadingTransporterPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }
    
    getViewType(): string {
        return HEADING_SELECTOR_VIEW_TYPE
    }

    getDisplayText(): string {
        return 'Heading Selector View'
    }

    async onOpen() {
        this.display()
        console.log("onOpen")
    }

    async onClose() {
        console.log("onClose")
        
    }

    async display() {

        const container = this.contentEl;
        container.empty();
        
        container.createEl('h2', { text: 'Heading Selector'});
        
        for (let index = 0; index < this.settings.headingInfos.length; index++) {
            const headingContainer = container.createEl('div', {cls: "hsp-heading-container"})
            headingContainer.createEl('h4', { text: this.settings.headingInfos[index].headingName,
                cls: "hsp-heading"});
            headingContainer.addEventListener("click", () => {
                // Select heading when clicked
                this.settings.selectedHeadingIndex = index
                headingContainer.addClass("hsp-selected")
                this.plugin.saveSettings()
                console.log(this.settings.selectedHeadingIndex)
            })
        }
    }
}