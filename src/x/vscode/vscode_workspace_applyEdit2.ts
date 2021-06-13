import vscode from "vscode"
import { vscode_TextDocument_fullTextRange } from "./vscode_TextDocument_fullTextRange"
import { lazy, memo } from "x/decorators"

/**
 * A simple datastructure that represents a "patch"
 */
export type FileMap = Map<string, string | undefined>

export async function vscode_workspace_applyEdit2(opts: Opts) {
  const applier = new ApplyChanges(opts)
  await applier.run()
}

export async function vscode_workspace_applyEdit2_getWorkspaceEdits(
  files: FileMap
) {
  const applier = new ApplyChanges({ files })
  return await applier.getWorkspaceEdit()
}

interface Opts {
  files: FileMap
  save?: boolean
}

class ApplyChanges {
  constructor(public opts: Opts) {}
  @memo() async getWorkspaceEdit() {
    const we = new vscode.WorkspaceEdit()
    await Promise.all(this.changes.map((change) => change.apply(we)))
    return we
  }
  async run() {
    const we = await this.getWorkspaceEdit()
    await vscode.workspace.applyEdit(we)
    if (this.opts.save)
      await Promise.all(this.changes.map((change) => change.tryToSave()))
  }
  @lazy() get changes() {
    return Array.from(this._changes())
  }
  private *_changes() {
    for (const [k, v] of this.opts.files.entries())
      yield new ApplyChanges_Change(k, v)
  }
}
class ApplyChanges_Change {
  constructor(public filePath: string, public newContent: string | undefined) {}
  async apply(workspaceEdit: vscode.WorkspaceEdit) {
    if (typeof this.newContent === "undefined") {
      if (await this.exists()) workspaceEdit.deleteFile(this.uri)
    } else {
      // new content is string
      if (await this.exists()) {
        // change file
        const doc = await this.openTextDocument()
        const fullRange = vscode_TextDocument_fullTextRange(doc)
        workspaceEdit.replace(this.uri, fullRange, this.newContent)
      } else {
        // create new file
        workspaceEdit.createFile(this.uri)
        workspaceEdit.insert(
          this.uri,
          new vscode.Position(0, 0),
          this.newContent
        )
      }
    }
  }
  @lazy() get uri() {
    return vscode.Uri.file(this.filePath)
  }
  @memo()
  async openTextDocument() {
    const doc = await vscode.workspace.openTextDocument(this.uri)
    const isOpen = vscode.window.visibleTextEditors.some(
      (e) => e.document.fileName === doc.fileName
    )
    if (!isOpen)
      vscode.window.showTextDocument(doc, {
        preserveFocus: true,
        viewColumn: vscode.ViewColumn.Beside,
      })
    return doc
  }
  @lazy() get doc() {
    return vscode.workspace.textDocuments.find(
      (d) => d.fileName === this.filePath
    )
  }
  @memo() async getContent(): Promise<string | undefined> {
    try {
      if (this.doc) return this.doc.getText()
      return (await vscode.workspace.fs.readFile(this.uri)).toString()
    } catch (e) {}
  }
  @memo() async exists(): Promise<boolean> {
    if (this.doc) return true
    return typeof (await this.getContent()) === "string"
  }
  @lazy() get isOpen(): boolean {
    if (this.doc) return true
    return false
  }
  @lazy() get isDirty(): boolean {
    return this.doc?.isDirty === true
  }
  async tryToSave() {
    if (typeof this.newContent === "undefined") return
    await (await this.openTextDocument()).save()
  }
}
