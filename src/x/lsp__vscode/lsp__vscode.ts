import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { lsp_Location__vscode_Location } from "./lsp_Location__vscode_Location"
import { lsp_Range__vscode_Range } from "./lsp_Range__vscode_Range"

export function lsp_Declaration__vscode_Declaration(
  d: lsp.Declaration
): vscode.Declaration {
  if (Array.isArray(d)) {
    return d.map(lsp_Declaration__vscode_Declaration) as any
  }
  return lsp_Location__vscode_Location(d)
}

export function lsp_Hover__vscode_Hover(
  d: lsp.Hover,
  trustedMarkdown = false
): vscode.Hover {
  const range = d.range ? lsp_Range__vscode_Range(d.range) : undefined
  return new vscode.Hover(ccc(d.contents) as any, range)
  function ccc(c: lsp.Hover["contents"]) {
    if (Array.isArray(c)) return c.map(ccc)
    if (typeof c === "string") {
      return ms(c)
    }
    if (lsp.MarkupContent.is(c)) {
      return ms(c.value)
    }
    return c
  }
  function ms(value: string) {
    const mm = new vscode.MarkdownString(value)
    if (trustedMarkdown) mm.isTrusted = true
    return mm
  }
}
