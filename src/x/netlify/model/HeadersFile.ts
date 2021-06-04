import { ArrayLike } from "src/x/Array/ArrayLike"
import { memo } from "src/x/decorators"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import { FileNode } from "./base"
import { Project } from "./Project"
import * as lsp from "vscode-languageserver"

export class HeadersFile extends FileNode {
  constructor(public project: Project, filePath: string) {
    super(filePath)
  }
  @memo() getDiagnostics(): ArrayLike<ExtendedDiagnostic> {
    const d: ExtendedDiagnostic = {
      uri: this.uri,
      diagnostic: {
        message: "Blaaaa",
        range: {
          start: { line: 2, character: 2 },
          end: { line: 2, character: 17 },
        },
      },
    }
    return [d]
  }
  @memo() getSymbols() {
    const range = {
      start: { line: 2, character: 2 },
      end: { line: 2, character: 17 },
    }
    const sym1: lsp.DocumentSymbol = {
      name: "symbol 1",
      kind: lsp.SymbolKind.Object,
      range,
      selectionRange: range,
    }
    return sym1
  }
}
