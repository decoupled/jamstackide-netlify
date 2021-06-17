import { vscode_workspace_applyEdit2 } from "@decoupled/xlib"
import { TOMLHelper } from "./toml_parse_nodes"
import * as lsp from "vscode-languageserver-types"
import vscode from "vscode"
import { lsp_Range__vscode_Range } from "x/lsp__vscode/lsp_Range__vscode_Range"

{
  const src = `
[context.production]
foo="bar"
[context.floofy]
    `.trim()
  const r = netlify_toml_inserts_insertPath(src, [
    "context",
    "production",
    "processing",
    "css",
    "bundle",
  ])
  console.log(r.src.split("\n"))
}

const resss = {
  src: `[context.production]
    foo="bar"
    [context.production.processing.css]
    bundle = false`,
  select: {
    start: {
      line: 3,
      character: 1,
    },
    end: {
      line: 3,
      character: 1,
    },
  },
}

// vscode_workspace_applyEdit2

interface Result {
  src: string
  select: lsp.Range
}

export function netlify_toml_inserts_insertPath(
  src: string,
  path: string[]
): Result | undefined {
  const h = new TOMLHelper(src)
  const ancestor = h.findClosestAncestorByPath(path)
  const last = path[path.length - 1]
  if (last === "bundle" || last === "minify") {
    if (!ancestor) {
    } else {
      const xxx = [...path]
      xxx.pop()
      const key = xxx.join(".")
      const newLines = ["", `[${key}]`, `${last} = false`, ""]
      const srcLines = src.split("\n")
      if (ancestor.ancestor.type !== "ObjectPath") return // not supported yet
      const lineN = h.getLastNodeInSection(ancestor.ancestor).line
      srcLines.splice(lineN, 0, ...newLines)
      return {
        src: srcLines.join("\n"),
        select: {
          start: { line: lineN, character: 0 },
          end: { line: lineN, character: 0 },
        } as lsp.Range,
      }
    }
  }
}

export async function netlify_toml_inserts_insertPath_vscode(
  editor: vscode.TextEditor,
  path: string[]
) {
  try {
    const rr = netlify_toml_inserts_insertPath(editor.document.getText(), path)
    if (!rr) return
    await vscode_workspace_applyEdit2({
      files: new Map([[editor.document.fileName, rr.src]]),
    })
    editor.revealRange(
      lsp_Range__vscode_Range(rr.select),
      vscode.TextEditorRevealType.InCenter
    )
  } catch (e) {
    console.log(e)
  }
}

class NetlifyTOMLInserts {
  constructor() {}
}
