import { HeadingTransporterSettings } from "main";
import { App, TFile, Vault, Workspace } from "obsidian";

export type HeadingInfo = {
    headingName: string;
    path: string;
}


// export class HeadingInfo {
//     headingName: string;
//     file: TFile;

//     constructor(headingName: string, file: TFile) {
//         this.headingName = headingName
//         this.file = file
//     }
// }

export const TransportToHeading = (value: string, headingInfo: HeadingInfo, app: App) => {
    const vault = app.vault
    const headingFile = vault.getFileByPath(headingInfo.path)

    if (!headingFile) return
    vault.read(headingFile).then((fileContent) => {
        const headingPosition = fileContent.search("# " + headingInfo.headingName) + headingInfo.headingName.length + 2
        
        const updatedFileContent = fileContent.slice(0, headingPosition) + value + fileContent.slice(headingPosition)
        vault.modify(headingFile, updatedFileContent)
        console.log()
        
    })
    
    
}