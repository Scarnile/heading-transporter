import { App, Editor, PluginSettingTab, TFile, Vault, Workspace } from "obsidian";
import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { HeadingSelectorView } from "headingSelectorView";

export type HeadingInfo = {
    headingName: string;
    path: string;
}

export class HeadingSelectionContext {
    constructor(
        public app: App,
        public plugin: HeadingTransporterPlugin,
        public headingSelectorView: HeadingSelectorView,
    ) {}
}

export const SaveHeading = (headingName: string, path: string, settings: HeadingTransporterSettings) => {
    const heading: HeadingInfo = {headingName: headingName, path: path}
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

export const TransportToHeading = (value: string, headingSelectionContext: HeadingSelectionContext) => {

    const settings = headingSelectionContext.plugin.settings
    const selectedHeadingIndex = settings.selectedHeadingIndex
    const headingInfo = settings.headingInfos[selectedHeadingIndex]
    const vault = headingSelectionContext.app.vault

    const headingFile = vault.getFileByPath(headingInfo.path)
    const headingName = headingInfo.headingName

    if (!headingFile) return

    vault.read(headingFile).then((fileContent) => {
        const headingPosition = fileContent.search("# " + headingName) + headingName.length + 2
        
        const updatedFileContent = fileContent.slice(0, headingPosition) + "\n" + value + fileContent.slice(headingPosition)
        vault.modify(headingFile, updatedFileContent)
        
    })
    
}

export const CheckHeadingExists = (headingSelectionContext: HeadingSelectionContext) => {

    const headingSelectorView = headingSelectionContext.headingSelectorView
    const vault = headingSelectionContext.app.vault
    const plugin = headingSelectionContext.plugin
    const settings = headingSelectionContext.plugin.settings
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