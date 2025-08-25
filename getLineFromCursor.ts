import { Editor } from "obsidian"

export const getLineFromCursor = (editor: Editor) => {
    const linePosition = editor.getCursor('from').line
    const lineContent = editor.getLine(linePosition)
    return lineContent
}