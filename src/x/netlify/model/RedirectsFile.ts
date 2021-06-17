import { lazy, memo } from "@decoupled/xlib"
import {
  NetlifyRedirectParserResult,
  netlify_redirect_parser_from_source,
} from "x/netlify-redirect-parser/netlify_redirect_parser"
import * as lsp from "vscode-languageserver-types"
import { IFileSystem } from "x/fs/IFileSystem"
import { FileNode, FilePath } from "./base"

export class RedirectsFile extends FileNode {
  constructor(filePath: FilePath, fs: IFileSystem) {
    super(filePath, fs)
  }

  @memo() raw(): Promise<NetlifyRedirectParserResult> {
    return netlify_redirect_parser_from_source(this.readFileSync())
  }

  @lazy() get lines(): string[] {
    return this.readFileSync().split("\n")
  }

  async *getDiagnostics() {
    const raw = await this.raw()
    for (const err of raw.errors) {
      const line = err.lineNum - 1
      const range: lsp.Range = {
        start: { line, character: 0 },
        end: { line, character: this.lines[line].length },
      }
      const diagnostic = {
        range,
        message: "Invalid Redirect Rule",
      } as lsp.Diagnostic
      yield { uri: this.uri, diagnostic }
    }
  }
}

class Line {
  constructor(src: string) {}
}
const samplefile =
  "/Users/aldo/com.github/decoupled/netlify-vscode-extension/src/x/_playgrounds/netlify_redirect_files/a2"
