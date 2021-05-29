import { lazy, memo } from "src/x/decorators"
import {
  NetlifyRedirectParserResult,
  netlify_redirect_parser_from_source,
} from "src/x/netlify-redirect-parser/netlify_redirect_parser"
import * as lsp from "vscode-languageserver-types"
import { FileNode } from "./base"
import { Project } from "./Project"

export class RedirectsFile extends FileNode {
  constructor(public project: Project, filePath: string) {
    super(filePath)
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
