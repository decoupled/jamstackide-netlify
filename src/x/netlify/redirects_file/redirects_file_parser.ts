import { lazy, memo } from "src/x/decorators"
import {
  netlify_redirect_parser_from_source,
  NetlifyRedirectParserResult,
} from "src/x/netlify-redirect-parser/netlify_redirect_parser"
import * as lsp from "vscode-languageserver-types"

class File {
  constructor(public src: string) {}
  @memo() raw(): Promise<NetlifyRedirectParserResult> {
    return netlify_redirect_parser_from_source(this.src)
  }
  @lazy() get lines(): string[] {
    return this.src.split("\n")
  }
  async *diagnostics(): AsyncGenerator<lsp.Diagnostic> {
    const raw = await this.raw()
    for (const err of raw.errors) {
      const line = err.lineNum
      const range: lsp.Range = {
        start: { line, character: 0 },
        end: { line, character: this.lines[line].length },
      }
      yield { range, message: "Syntax error" } as lsp.Diagnostic
    }
  }
}

class Line {
  constructor(src: string) {}
}
const samplefile =
  "/Users/aldo/com.github/decoupled/netlify-vscode-extension/src/x/_playgrounds/netlify_redirect_files/a2"

{
  const ff = new File(samplefile)
  const raw = await ff.raw()
  console.log(raw)
}
