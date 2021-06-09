import { ArrayLike } from "src/x/Array/ArrayLike"
import { memo } from "src/x/decorators"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import * as lsp from "vscode-languageserver"
import { FileNode, FilePath } from "./base"
import { IFileSystem } from "x/fs/IFileSystem"
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
