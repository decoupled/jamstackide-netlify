import { ArrayLike } from "src/x/Array/ArrayLike"
import { memo } from "src/x/decorators"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import { FileNode } from "./base"
import { Project } from "./Project"

export class HeadersFile extends FileNode {
  constructor(public project: Project, filePath: string) {
    super(filePath)
  }
  @memo() getDiagnostics(): ArrayLike<ExtendedDiagnostic> {
    const d: ExtendedDiagnostic = {
      uri: this.uri,
      diagnostic: {
        message: "hello world",
        range: {
          start: { line: 1, character: 1 },
          end: { line: 2, character: 6 },
        },
      },
    }
    return [d]
  }
}
