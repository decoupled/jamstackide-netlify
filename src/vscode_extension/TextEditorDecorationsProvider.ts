import { lsp_Range__vscode_Range } from "x/lsp__vscode/lsp_Range__vscode_Range"
import {
  vscode_decoration_types_all,
  vscode_decoration_types_find,
} from "x/netlify/etc/vscode_decoration_types"
import { vscode_TextEditor_setDecorations_pivot_Item } from "x/vscode/vscode_TextEditor_setDecorations_pivot"
import * as vscode from "vscode"
import { TextEditorDecorationsProviderFromLSPClient } from "./TextEditorDecorationsProviderFromLSPClient"

export class TextEditorDecorationsProvider {
  constructor(private p: TextEditorDecorationsProviderFromLSPClient) {}
  async getDecorationsForDoc(
    uri: vscode.Uri
  ): Promise<vscode_TextEditor_setDecorations_pivot_Item[]> {
    const raw = await this.p.getDecorationsForDoc(uri)
    return raw.map((r) => {
      const decorationType = vscode_decoration_types_find(r.type)
      if (!decorationType)
        throw new Error("decoration type not defined: " + decorationType)
      return {
        decorationType,
        rangeOrOptions: lsp_Range__vscode_Range(r.range),
      } as vscode_TextEditor_setDecorations_pivot_Item
    })
  }
  getAllDecorationTypes(): vscode.TextEditorDecorationType[] {
    return vscode_decoration_types_all()
  }
}
