import { ArrayLike, memo } from "@decoupled/xlib"
import * as lsp from "vscode-languageserver"
import { IFileSystem } from "x/fs/IFileSystem"
import { ExtendedDiagnostic } from "x/vscode-languageserver-types/lsp_extensions"
import { FileNode, FilePath } from "./base"
export class HeadersFile extends FileNode {
  constructor(filePath: FilePath, fs: IFileSystem) {
    super(filePath, fs)
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
    return []
  }
  @memo() getSymbols() {
    // TODO: just a reminder that we need to do this
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
