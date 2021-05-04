import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"

export function lsp_Position__vscode_Position(
  p: lsp.Position
): vscode.Position {
  return new vscode.Position(p.line, p.character)
}
