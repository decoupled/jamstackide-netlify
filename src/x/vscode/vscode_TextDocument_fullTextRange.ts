import vscode from "vscode"

/**
 * Returns a vscode.Range that covers a complete vscode.TextDocument
 */
export function vscode_TextDocument_fullTextRange(
  doc: vscode.TextDocument
): vscode.Range {
  const firstLine = doc.lineAt(0)
  const lastLine = doc.lineAt(doc.lineCount - 1)
  return new vscode.Range(
    0,
    firstLine.range.start.character,
    doc.lineCount - 1,
    lastLine.range.end.character
  )
}
