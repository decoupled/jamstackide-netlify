import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { lsp_Range__vscode_Range } from "./lsp_Range__vscode_Range"

export function lsp_Location__vscode_Location(
  p: lsp.Location
): vscode.Location {
  return new vscode.Location(
    vscode.Uri.parse(p.uri),
    lsp_Range__vscode_Range(p.range)
  )
}
