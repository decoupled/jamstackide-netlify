import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { lsp_Diagnostic__vscode_Diagnostic } from "x/lsp__vscode/lsp_Diagnostic__vscode_Diagnostic"
import object_hash from "object-hash"

export function vscode_languages_SmartDiagnosticsCollection(name: string) {
  return new SmartDiagnosticsCollection(name)
}

/**
 * performs structural equality checks before updating the diagnostics for any given doc.
 * to prevent setting an equivalent set of diagnostics twice, which would cause flicker (ex: when looking at hover messages)
 */
class SmartDiagnosticsCollection {
  constructor(public name: string) {}
  private collection = vscode.languages.createDiagnosticCollection(this.name)
  set(uri: vscode.Uri, diagnostics: lsp.Diagnostic[]) {
    if (diagnostics.length === 0) this.delete(uri)
    // start equality check (to prevent setting twice, which would cause flicker)
    const hash = object_hash(diagnostics, { unorderedArrays: true })
    if (this._hashes.get(uri.toString()) === hash) return
    this._hashes.set(uri.toString(), hash)
    // end equality check
    const ds2 = diagnostics.map(lsp_Diagnostic__vscode_Diagnostic)
    this.collection.set(uri, ds2)
  }

  private _hashes = new Map<lsp.DocumentUri, string>()

  private getCurrentDocsInCollection() {
    const uris = new Set<vscode.Uri>()
    this.collection.forEach((uri) => uris.add(uri))
    return uris
  }
  private async getCurrentDocsInCollection_thatNoLongerExist() {
    const uris = this.getCurrentDocsInCollection()
    const urisToDelete = new Set<vscode.Uri>()
    await Promise.all(
      Array.from(uris).map(async (uri) => {
        if (!(await uriExists(uri))) urisToDelete.add(uri)
      })
    )
    return urisToDelete
    async function uriExists(uri: vscode.Uri) {
      for (const doc of vscode.workspace.textDocuments) {
        if (doc.uri.toString() === uri.toString()) return true
      }
      try {
        await vscode.workspace.fs.readFile(uri)
        return true
      } catch (e) {}
    }
  }
  delete(uri: vscode.Uri) {
    if (!this.collection.has(uri)) return
    this.collection.delete(uri)
    this._hashes.delete(uri.toString())
  }
  async cleanup() {
    const urisToDelete = await this.getCurrentDocsInCollection_thatNoLongerExist()
    urisToDelete.forEach((uri) => this.collection.set(uri, []))
  }
}
