import { App, Editor, PluginSettingTab, TFile, Vault, Workspace } from "obsidian";
import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { BaseManager } from "baseManager";
import { HeadingSelectorView } from "headingSelectorView";
import { getLineFromCursor } from "getLineFromCursor";
import { v4 as uuidv4 } from "uuid";

export type HeadingInfo = {
    id: string;
    name: string;
    path: string;
}

export class PluginContext {
    constructor(
        public app: App,
        public plugin: HeadingTransporterPlugin,
        public headingSelectorView: HeadingSelectorView,
    ) {}
}

export class HeadingManager extends BaseManager<HeadingInfo>{

    // Convert initial data to a map
    constructor(initialData?: HeadingInfo[]) {
        super();
        if (initialData) {
            for(const heading of initialData) {
                this.items.set(heading.id, heading)
            }
        }
    }

    createHeadingInfo = (name: string, path: string): HeadingInfo => {
        return {
            id: uuidv4(),
            name,
            path
        }
    }

    saveHeading = (headingName: string, path: string) => {
        const heading = this.createHeadingInfo(headingName, path)
        this.items.set(heading.id, heading)
        return heading
    }

    getAllHeadings(): HeadingInfo[] {
        return [...this.items.values()]
    }

    
}

export const TransportToHeading = (selectedHeadingId: number, pluginContext: PluginContext) => {

    const {app, plugin} = pluginContext
    const {vault, workspace} = app
    const {settings, categoryManager} = plugin
    const {headingInfos, selectedCategoryId} = settings

    const editor = workspace.activeEditor?.editor
    if (!editor) return

    const headingInfo = headingInfos[selectedHeadingId]
    const headingFile = vault.getFileByPath(headingInfo.path)
    const headingName = headingInfo.name

    if (!headingFile) return

    const headingIds = categoryManager.getHeadingIdsFromCategory(selectedCategoryId)
    const selection = getLineFromCursor(editor)

    vault.read(headingFile).then((fileContent) => {
        const headingPosition = fileContent.search("# " + headingName) + headingName.length + 2
        
        const updatedFileContent = fileContent.slice(0, headingPosition) + "\n" + selection + fileContent.slice(headingPosition)
        vault.modify(headingFile, updatedFileContent)
        
    })

    //Cut content of line to transport
    if (settings.cutWithCommand) {
        editor.setLine(editor.getCursor().line, "")
    }
    
}

export const MoveHeadingSelection = (indexShift: number, pluginContext: PluginContext) => {
    const settings = pluginContext.plugin.settings
    let settingHeadingIndex = settings.selectedHeadingIndex
    const headingInfosLength = settings.headingInfos.length
    const newHeadingIndex = settingHeadingIndex += indexShift
    
    // console.log(headingInfosLength)
    if (newHeadingIndex < 0 || newHeadingIndex >= headingInfosLength) return
    
    settings.selectedHeadingIndex += indexShift
    pluginContext.headingSelectorView.display()
    pluginContext.plugin.saveData(settings);
}

export const CheckHeadingExists = (pluginContext: PluginContext) => {

    const headingSelectorView = pluginContext.headingSelectorView
    const vault = pluginContext.app.vault
    const plugin = pluginContext.plugin
    const settings = pluginContext.plugin.settings
    const headingInfos = settings.headingInfos

    headingInfos.forEach(headingInfo => {
        let headingExists = false
        const headingFile = vault.getFileByPath(headingInfo.path)
        if (!headingFile) return null

        vault.cachedRead(headingFile).then((fileContent) => {

            const settingHeadingName = headingInfo.name
            const lineArray = fileContent.split("\n")

            lineArray.forEach(line => {

                const isHeading = IsLineAHeading(line)
                if (!isHeading) return null

                const lineHeadingName = GetHeadingName(line)

                // If heading exists in the settings
                if (lineHeadingName == settingHeadingName) {
                    headingExists = true
                }
                
            });

            // Remove from settings if it doesn't exist
            if(!headingExists) {
                console.log(headingInfo.name + " doesn't exist")
                headingInfos.remove(headingInfo);
                headingSelectorView.display();
                plugin.saveSettings()
            }
    })
    })
}

export const RemoveHeading = (headingInfos: HeadingInfo[], index: number) => {
    headingInfos.splice(index)
}

export const IsLineAHeading = (lineContent: string) => {
    return (lineContent.charAt(0) == "#") ? true : false
}

export const GetHeadingName = (lineContent: string) => {
    return lineContent.replace("#", "").trim()
}