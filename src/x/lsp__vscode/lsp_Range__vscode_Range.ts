import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { lsp_Position__vscode_Position } from "./lsp_Position__vscode_Position"

export function lsp_Range__vscode_Range(r: lsp.Range): vscode.Range {
  return new vscode.Range(
    lsp_Position__vscode_Position(r.start),
    lsp_Position__vscode_Position(r.end)
  )
}
