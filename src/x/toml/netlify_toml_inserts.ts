import * as xlib from "@decoupled/xlib"
import { vscode_workspace_applyEdit2 } from "@decoupled/xlib"
import vscode from "vscode"
import * as lsp from "vscode-languageserver-types"
import { TOMLHelper } from "./toml_parse_nodes"
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
  console.log(r)
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
  path: string[],
  schema?: any,
  value?: string
): Result | undefined {
  let hint: "arr-push" | undefined = undefined
  if (schema?.type === "array") {
    hint = "arr-push"
  }
  const insertInfo = xlib.toml_path_to_insert_info(src, { path, hint })
  if (!insertInfo) return
  if (typeof value === "undefined") {
    if (schema?.type === "string") {
      value = '""'
    }
    if (schema?.type === "boolean") {
      value = "true"
    }
    if (schema?.type === "object") {
      value = "{ }"
    }
  }
  if (typeof value === "undefined") value = ""
  const toInsert = insertInfo.before + value + insertInfo.after
  const src2 = xlib.Position_insert(
    src,
    toInsert,
    insertInfo.position,
    "yes-add-new-line"
  )
  // TODO: focus only on the "value" part
  // or use "snippets"
  const start = insertInfo.position
  const end: lsp.Position = { line: start.line, character: start.character + 1 }
  const select: lsp.Range = { start, end }
  return { src: src2, select }
}

export async function netlify_toml_inserts_insertPath_vscode(
  editor: vscode.TextEditor,
  path: string[],
  schema?: any
) {
  try {
    const rr = netlify_toml_inserts_insertPath(
      editor.document.getText(),
      path,
      schema
    )
    if (!rr) return
    await vscode_workspace_applyEdit2({
      files: new Map([[editor.document.fileName, rr.src]]),
    })

    const range = xlib.Range_iso.reverseGet(rr.select)
    editor.selection = new vscode.Selection(range.start, range.end)
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter)
  } catch (e) {
    console.log(e)
  }
}
