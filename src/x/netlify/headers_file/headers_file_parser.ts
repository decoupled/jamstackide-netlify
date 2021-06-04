import { lazy } from "src/x/decorators"
import * as lsp from "vscode-languageserver-types"
import {
  DecorationData_make as dec,
  DecorationType,
  DecorationData,
  DecorationData_is,
} from "../etc/DecorationData"

// https://github.com/netlify/cli/blob/c9530e8d99f5be911b42d22b70925cd978dc6bc4/src/utils/headers.js

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

// indentation guides?
// https://github.com/JoeRobich/vscode-indent-guides/blob/master/src/extension.ts

export function headers_file_parser(src: string) {
  return new HeadersFile(src).render_all
}

export function headers_file_parser22(src: string) {
  return new HeadersFile(src)
}

export class HeadersFile {
  constructor(public src: string) {}
  @lazy() get lines() {
    return this.src.split("\n").map((l, i) => new Line(this, i, l))
  }
  @lazy() get paths(): Path[] {
    return this.lines
      .map((l) => l.content)
      .filter((x): x is Path => x instanceof Path)
  }
  private *render() {
    for (const line of this.lines) yield* line.render()
    // if (line.content) for (const x of line.content.render()) yield x
  }
  @lazy() get render_all() {
    return Array.from(this.render())
  }
  @lazy() get symbols() {
    return this.paths.map((x) => x.symbol)
  }
  @lazy() get decorations(): DecorationData[] {
    return Array.from(this.render_all).filter(DecorationData_is)
  }
}

export class Line {
  constructor(
    public parent: HeadersFile,
    public lineNumber: number,
    public str: string
  ) {}
  @lazy() get isComment(): boolean {
    return this.contentTextTrimmed.startsWith("#")
  }
  @lazy() get indent(): number | undefined {
    return num_indent(this.str)
  }
  @lazy() get contentText(): string {
    return this.str
  }
  @lazy() get contentTextTrimmed(): string {
    return this.str.trim()
  }
  @lazy() get contentRange(): lsp.Range | undefined {
    const { lineNumber: line, indent: start } = this
    if (typeof start !== "number") return undefined
    const len = this.str.trim().length
    const end = start + len
    return { start: pos(start), end: pos(end) }
    function pos(character: number): lsp.Position {
      return { line, character }
    }
  }
  @lazy() get range(): lsp.Range {
    const { lineNumber: line } = this
    return {
      start: { line, character: 0 },
      end: { line, character: this.str.length },
    }
  }
  @lazy() get content(): Header | Path | Comment | undefined {
    if (this.isComment) return new Comment(this)
    const id = this.indent
    if (typeof id !== "number") return undefined
    if (id === 0) return new Path(this)
    return new Header(this)
  }
  @lazy() get next(): Line | undefined {
    return this.parent.lines[this.lineNumber + 1]
  }

  *render() {
    if (this.content) {
      yield* this.content.render()
    }
    for (const idx of getAllPunctuationIndexes(this.contentText)) {
      const line = this.lineNumber
      yield dec(DecorationType.headers__punctuation, {
        start: { line, character: idx },
        end: { line, character: idx + 1 },
      })
    }
  }
}

export class Comment {
  constructor(public parent: Line) {}
  *render() {
    yield {
      contents: "this is a comment " + this.parent.contentTextTrimmed,
      range: this.parent.contentRange,
    } as lsp.Hover
    yield dec(DecorationType.headers__comment, this.parent.contentRange!)
  }
}

export class Path {
  constructor(public parent: Line) {}
  *render() {
    yield {
      contents: "this is a path " + this.pathAsText,
      range: this.parent.contentRange,
    } as lsp.Hover
    yield dec(DecorationType.headers__path, this.parent.contentRange!)
  }
  @lazy() get pathAsText() {
    return this.parent.contentTextTrimmed
  }
  @lazy() get pathRange() {
    return this.parent.contentRange!
  }
  @lazy() get fullRange(): lsp.Range {
    const r1 = this.parent.range
    const r2 = this.lastLine.range
    return { start: r1.start, end: r2.end }
  }
  @lazy() get headers(): Header[] {
    return this.__readAhead.headers
  }
  @lazy() private get __readAhead() {
    const idx = this.parent.lineNumber
    const lines = this.parent.parent.lines
    const headers: Header[] = []
    let nextPath: Path | undefined
    let lastLineNumber = 0
    for (let i = idx + 1; i < lines.length; i++) {
      lastLineNumber = i
      const c = lines[i].content
      if (c instanceof Path) {
        lastLineNumber = i - 1
        nextPath = c
        break
      }
      if (c instanceof Header) headers.push(c)
    }
    return { headers, nextPath, lastLineNumber }
  }
  @lazy() get lastLineNumber(): number {
    return this.__readAhead.lastLineNumber
  }
  @lazy() get lastLine(): Line {
    return this.parent.parent.lines[this.lastLineNumber]
  }
  @lazy() get nextPath(): Path | undefined {
    return this.__readAhead.nextPath
  }
  @lazy() get symbol(): lsp.DocumentSymbol {
    return {
      kind: lsp.SymbolKind.Object,
      name: this.pathAsText,
      selectionRange: this.parent.contentRange!,
      range: this.fullRange,
      children: this.headers.map((x) => x.symbol),
    }
  }
}

export class Header {
  constructor(public parent: Line) {}
  *render() {
    // yield {
    //   contents: "this is a header " + this.parent.contentTextTrimmed,
    //   range: this.parent.contentRange,
    // } as lsp.Hover
    yield dec(DecorationType.headers__header_name, this.headerNameRange)
    if (this.indexOfColon !== -1) {
      const line = this.parent.lineNumber
      const idx = this.indexOfColon
      yield dec(DecorationType.headers__punctuation, {
        start: { line, character: idx },
        end: { line, character: idx + 1 },
      })
    }
  }
  @lazy() get headerNameRange(): lsp.Range {
    const { start } = this.parent.contentRange
    const end: lsp.Position = {
      line: start.line,
      character: start.character + this.headerNameTrimmedText.length,
    }
    return { start, end }
  }

  @lazy() get headerNameTrimmedText(): string {
    return this.parent.str.split(":")[0].trim()
  }

  @lazy() get headerValueTrimmedText(): string | undefined {
    const ioc = this.indexOfColon
    if (ioc === -1) return
    const r = this.parent.str.substr(ioc + 1).trim()
    if (r.length === 0) return
    return r
  }

  @lazy() get indexOfColon() {
    return this.parent.str.indexOf(":")
  }
  @lazy() get headerName(): HeaderName | undefined {
    const ii = this.parent.str.indexOf(":")
    if (ii) {
    }
    return undefined
  }
  @lazy() get headerValue(): HeaderValue | undefined {
    return undefined
  }
  @lazy() get symbol(): lsp.DocumentSymbol {
    return {
      kind: lsp.SymbolKind.Property,
      name: this.headerNameTrimmedText,
      range: this.parent.contentRange!,
      selectionRange: this.headerNameRange,
      detail: "= " + this.headerValueTrimmedText,
    }
  }
}

export class HeaderName {
  constructor(public parent: Header) {}
}

export class HeaderValue {
  constructor(public parent: Header) {}
}

const example = `
/templates/index.html
  # headers for that path:
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block

# another path:
/templates/index2.html
  # headers for that path:
  X-Frame-Options: SAMEORIGIN

/*
  cache-control: max-age=0
  cache-control: no-cache
  cache-control: no-store
  cache-control: must-revalidate
`

{
  const hf = new HeadersFile(example)
  console.log("aloha")
  const ss = hf.render_all
  console.log(ss)
  console.log(hf.paths[0])
  const hh = hf.paths[0].headers
  console.log(hh)
}

function num_indent(line: string): number | undefined {
  if (line.trim().length === 0) return undefined
  for (let i = 0; i < line.length; i++) {
    const chr = line[i]
    if (chr === " " || chr === "\t") continue
    return i
  }
  return undefined
}

{
  getAllPunctuationIndexes("ab/cd/ef")
  getAllPunctuationIndexes("a=b")
  getAllPunctuationIndexes("a;b")
}

function getAllPunctuationIndexes(str: string) {
  const re = /[\/:;=]/gi
  const indexes: number[] = []
  while (true) {
    const mm = re.exec(str)
    if (!mm) break
    indexes.push(mm.index)
  }
  return indexes
}
