import { basename } from "path"
import * as vscode from "vscode"

export function vscode_TextEditor_watch(
  ctx: vscode.ExtensionContext,
  fname: string,
  cb: (editor: vscode.TextEditor) => void
) {
  const w = vscode.workspace.createFileSystemWatcher(`**/${fname}`)
  vscode.workspace
    .findFiles(`**/${fname}`)
    .then((files) => files.forEach((file) => tick(file)))

  w.onDidChange(tick)
  w.onDidCreate(tick)
  ctx.subscriptions.push(w)
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (basename(event.document.fileName) === fname)
      tick(event.document.uri, event.document.getText())
  }, ctx.subscriptions)
  function tick(uri: vscode.Uri, src?: string) {
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === uri.toString()
    )
    if (!editor) return
    cb(editor)
  }
}
