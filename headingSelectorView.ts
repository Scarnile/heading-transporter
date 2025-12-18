import { HeadingInfo, RemoveHeading } from "heading";
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

        const headingsToDisplay = this.plugin.getHeadingsFromCategory(this.settings.selectedCategoryId)

        const container = this.contentEl;
        container.empty();

        // Add dropdown
        new Setting(container).addDropdown((dropdown) => {
            
            // Load the dropdown options with the saved categories
            const headingCategories = this.settings.headingCategories
            headingCategories.forEach((headingCategory) => {
                dropdown.addOption(headingCategory.id, headingCategory.name)
            })
            
            dropdown.setValue(this.settings.selectedCategoryId)
            dropdown.onChange(async (value) => {
                this.settings.selectedCategoryId = value
                this.display()
                await this.plugin.saveSettings()
            })
        }).setClass("hsp-dropdown")
        
        if (headingsToDisplay) {
            this.displayHeadings(headingsToDisplay, container)
        } 
        
    }
 
    displayHeadings(headings: HeadingInfo[]|[] , container: HTMLElement) {
        // Make a container for each headingInfo
        for (let index = 0; index < headings.length; index++) {
            
            const headingContainer = container.createEl('div', {cls: "hsp-heading-container"})
            headingContainer.createEl('p', { text: headings[index].headingName,
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
                            RemoveHeading(headings, index)
                            this.plugin.saveSettings()
                            this.display()
                        })
                }) 

                menu.showAtMouseEvent(event)
            })
        }
    }
}