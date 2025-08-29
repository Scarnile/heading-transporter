import { App, Editor, TFile, Vault, Workspace } from "obsidian";

import { HeadingTransporterSettings } from "main";

export type HeadingInfo = {
    headingName: string;
    path: string;
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

export const CheckHeadingExists = (headingInfo: HeadingInfo, vault: Vault) => {
    console.log("A")
    
    const headingFile = vault.getFileByPath(headingInfo.path)
    if (!headingFile) return
    console.log("B")

    vault.cachedRead(headingFile).then((fileContent) => {
        const lineArray = fileContent.split("\n")

        for (let lineIndex = 0; lineIndex < lineArray.length; lineIndex++) {
            const line = lineArray[lineIndex]
            console.log("C")


            const isHeading = IsLineAHeading(line)
            if (!isHeading) return
            console.log("D")

            const headingName = GetHeadingName(line)

            if (line == headingName) {
                console.log(headingName)
                
            }
        }
    })
}

export const IsLineAHeading = (lineContent: string) => {
    return (lineContent.charAt(0) == "#") ? true : false
}

export const GetHeadingName = (lineContent: string) => {
    return lineContent.slice(1).trim()
}