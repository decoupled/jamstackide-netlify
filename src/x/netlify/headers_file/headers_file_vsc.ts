import { readFileSync } from "fs-extra"
import { basename } from "path"
import { lazy } from "src/x/decorators"
import { lsp_Range__vscode_Range } from "src/x/lsp__vscode/lsp_Range__vscode_Range"
import {
  vscode_TextEditor_setDecorations_pivot,
  vscode_TextEditor_setDecorations_pivot_Item,
} from "src/x/vscode/vscode_TextEditor_setDecorations_pivot"
import * as vscode from "vscode"
import {
  HeaderFileDecoration_is,
  headers_file_parser,
} from "./headers_file_parser"

export async function headers_file_vsc(ctx: vscode.ExtensionContext) {
  new DecManager(ctx).start()
}

class DecManager {
  constructor(private ctx: vscode.ExtensionContext) {}
  start() {
    const { ctx, decorationTypes } = this
    const w = vscode.workspace.createFileSystemWatcher("**/_headers")
    vscode.workspace
      .findFiles("**/_headers")
      .then((files) => files.forEach((file) => tick(file)))

    w.onDidChange(tick)
    w.onDidCreate(tick)
    ctx.subscriptions.push(w)

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (basename(event.document.fileName) === "_headers")
        tick(event.document.uri, event.document.getText())
    }, ctx.subscriptions)

    function tick(uri: vscode.Uri, src?: string) {
      const editor = vscode.window.visibleTextEditors.find(
        (e) => e.document.uri.toString() === uri.toString()
      )
      if (!editor) return
      if (typeof src === "undefined") {
        src = readFileSync(uri.fsPath).toString()
      }
      const rest = headers_file_parser(src)
      vscode_TextEditor_setDecorations_pivot(
        editor,
        decorationTypes.allTypes,
        Array.from(dddsss())
      )
      function* dddsss(): Generator<vscode_TextEditor_setDecorations_pivot_Item> {
        for (const r of rest)
          if (HeaderFileDecoration_is(r)) {
            let decorationType: vscode.TextEditorDecorationType | undefined
            if (r.type === "comment")
              decorationType = decorationTypes.dec_comment
            if (r.type === "path") decorationType = decorationTypes.dec_path
            if (r.type === "punctuation")
              decorationType = decorationTypes.dec_punctuation
            if (r.type === "header_name")
              decorationType = decorationTypes.dec_header_name
            if (decorationType)
              yield {
                decorationType,
                rangeOrOptions: lsp_Range__vscode_Range(r.range),
              }
          }
      }
    }
  }
  @lazy() get decorationTypes() {
    return new DecorationTypeFactory()
  }
}

export class DecorationTypeFactory {
  @lazy() get allTypes() {
    // don't forget to add new decoration types here
    // they are necessary for the logic that "clear" previous decorations
    return [this.dec_comment]
  }

  dec_comment = vscode.window.createTextEditorDecorationType({
    // backgroundColor: "rgba(230,240,255,0.03)",
    color: "rgba(150,150,150,0.7)",
    // before: {
    //   contentText: "[<<] ",
    //   color: "magenta",
    // },
  })

  dec_header = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgba(100,100,255,0.1)",
  })

  dec_path = vscode.window.createTextEditorDecorationType({
    // backgroundColor: "rgba(100,255, 100,0.1)",
    color: "rgba(180,230, 255,0.7)",
    before: {
      contentText: "🌎",
      color: "rgba(100,100, 255,0.5)",
    },
  })

  dec_header_name = vscode.window.createTextEditorDecorationType({
    color: "rgba(100,100, 255,0.9)",
  })

  dec_punctuation = vscode.window.createTextEditorDecorationType({
    color: "rgba(150,150,150,0.4)",
  })

  private emojis = "🏀🌐🌎"
}
