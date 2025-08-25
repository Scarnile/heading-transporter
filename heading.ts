import { HeadingTransporterSettings } from "main";
import { App, TFile, Vault, Workspace } from "obsidian";

export type HeadingInfo = {
    headingName: string;
    path: string;
}

export const SaveHeading = (headingName: string, path: string, settings: HeadingTransporterSettings) => {
    const heading: HeadingInfo = {headingName: headingName, path: path}
    const headingInfos = settings.headingInfos

    let isAlreadySaved: boolean = false

    // Check if heading to be saved is already saved
    for (let index = 0; index < headingInfos.length; index++) {
        if (headingInfos[index] == heading){
            console.log("TURUE")
            isAlreadySaved = true
        }
    }

    if (isAlreadySaved == false) {
        headingInfos.push(heading)
    }

}

export const TransportToHeading = (value: string, headingInfo: HeadingInfo, app: App) => {
    const vault = app.vault
    const headingFile = vault.getFileByPath(headingInfo.path)
    const headingName = headingInfo.headingName

    if (!headingFile) return

    vault.read(headingFile).then((fileContent) => {
        const headingPosition = fileContent.search("# " + headingName) + headingName.length + 2
        
        const updatedFileContent = fileContent.slice(0, headingPosition) + "\n" + value + fileContent.slice(headingPosition)
        vault.modify(headingFile, updatedFileContent)
        
    })
    
}