import { App, Editor, PluginSettingTab, TFile, Vault, Workspace } from "obsidian";
import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { HeadingSelectorView } from "headingSelectorView";
import { getLineFromCursor } from "getLineFromCursor";
import { v4 as uuidv4 } from "uuid";

export type HeadingInfo = {
    id: string;
    headingName: string;
    path: string;
}

export type HeadingCategory = {
    categoryName: string;
    headingInfos: HeadingInfo[];
}

export class PluginContext {
    constructor(
        public app: App,
        public plugin: HeadingTransporterPlugin,
        public headingSelectorView: HeadingSelectorView,
    ) {}
}

export const createHeadingInfo = (name: string, path: string):HeadingInfo => {
    return {
        id: uuidv4(),
        headingName: name,
        path
    }
}

export const SaveHeading = (headingName: string, path: string, settings: HeadingTransporterSettings) => {
    const heading = createHeadingInfo(headingName, path)
    const headingInfos = settings.headingInfos

    let isAlreadySaved = false

    // Check if heading to be saved is already saved
    for (let index = 0; index < headingInfos.length; index++) {
        if (headingInfos[index] == heading){
            isAlreadySaved = true
        }
    }

    if (isAlreadySaved == false) {
        headingInfos.push(heading)
    }

}

export const TransportToHeading = (selectedHeadingIndex: number, pluginContext: PluginContext) => {

    const app = pluginContext.app
    const editor = app.workspace.activeEditor?.editor
    if (!editor) return

    const selection = getLineFromCursor(editor)

    const settings = pluginContext.plugin.settings
    const headingInfo = settings.headingInfos[selectedHeadingIndex]
    const vault = pluginContext.app.vault

    const headingFile = vault.getFileByPath(headingInfo.path)
    const headingName = headingInfo.headingName

    if (!headingFile) return

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

            const settingHeadingName = headingInfo.headingName
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
                console.log(headingInfo.headingName + " doesn't exist")
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