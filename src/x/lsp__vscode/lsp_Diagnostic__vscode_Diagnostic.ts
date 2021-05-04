import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { lsp_Location__vscode_Location } from "./lsp_Location__vscode_Location"
import { lsp_Range__vscode_Range } from "./lsp_Range__vscode_Range"

export function lsp_Diagnostic__vscode_Diagnostic(
  p: lsp.Diagnostic
): vscode.Diagnostic {
  return {
    message: p.message,
    range: lsp_Range__vscode_Range(p.range),
    severity: mapSeverity(p.severity),
    code: p.code,
    source: p.source,
    tags: p.tags,
    relatedInformation: p.relatedInformation?.map((r) => {
      return {
        location: lsp_Location__vscode_Location(r.location),
        message: r.message,
      }
    }),
  }
}

function mapSeverity(x?: lsp.DiagnosticSeverity) {
  return (x ?? lsp.DiagnosticSeverity.Error) - 1
}

// this doesn't work!
// total mystery. if you look at both enums, they are different. but that shouldn't matter if we map them using the enum name
function mapSeverity2(x?: lsp.DiagnosticSeverity): vscode.DiagnosticSeverity {
  const a = lsp.DiagnosticSeverity
  const b = vscode.DiagnosticSeverity
  switch (x) {
    case a.Error:
      return b.Error
    case a.Warning:
      return b.Warning
    case a.Information:
      return b.Information
    case a.Hint:
      return b.Hint
  }
  return a.Error
}
