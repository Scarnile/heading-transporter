import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";
import { ItemView, Menu, Notice, Setting, WorkspaceLeaf } from "obsidian"

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
    }

    async onClose() {
        
    }

    async display() {

        const container = this.contentEl;
        container.empty();
        
        container.createEl('h2', { text: 'Heading Selector'});
        
        for (let index = 0; index < this.settings.headingInfos.length; index++) {
            
            const headingContainer = container.createEl('div', {cls: "hsp-heading-container"})
            headingContainer.createEl('h6', { text: this.settings.headingInfos[index].headingName,
                cls: "hsp-heading"});

            // Color heading when selected only
            if (index == this.settings.selectedHeadingIndex) {
                headingContainer.addClass("hsp-selected")
            } else {
                if (headingContainer.classList.contains("hsp-selected")) {
                    headingContainer.removeClass("hsp-selected")
                }
            }

            headingContainer.addEventListener("click", () => {
                // Select heading when clicked
                this.settings.selectedHeadingIndex = index
                headingContainer.addClass("hsp-selected")
                this.plugin.saveSettings()
                console.log(this.settings.selectedHeadingIndex)
                this.display()
            })

            headingContainer.addEventListener("contextmenu", (event) => {
                const menu = new Menu()
                menu.addItem((item) => {
                    item
                        .setTitle('Remove')
                        .setIcon('trash')
                        .onClick(() => {
                            console.log(this.settings.headingInfos[index])
                            this.settings.headingInfos.splice(index)
                            this.display()
                        })
                }) 

                menu.showAtMouseEvent(event)
            })
        }
    }
}