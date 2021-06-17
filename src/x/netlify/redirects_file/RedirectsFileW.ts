import { vscode_TextEditor_watch } from "@decoupled/xlib"
import * as vscode from "vscode"

export class RedirectsFileW {
  constructor(private ctx: vscode.ExtensionContext) {
    this.start()
  }
  private start() {
    const { ctx } = this
    vscode_TextEditor_watch(ctx, "_redirects", (editor) => {
      const src = editor.document.getText()
      console.log("_redirects", src)
      // vscode_TextEditor_setDecorations_pivot(
      //   editor,
      //   decorationTypes.allTypes,
      //   Array.from(dddsss())
      // )
      // function* dddsss(): Generator<vscode_TextEditor_setDecorations_pivot_Item> {
      //   for (const r of rest)
      //     if (HeaderFileDecoration_is(r)) {
      //       let decorationType: vscode.TextEditorDecorationType | undefined
      //       if (r.type === "comment")
      //         decorationType = decorationTypes.dec_comment
      //       if (r.type === "path") decorationType = decorationTypes.dec_path
      //       if (r.type === "punctuation")
      //         decorationType = decorationTypes.dec_punctuation
      //       if (r.type === "header_name")
      //         decorationType = decorationTypes.dec_header_name
      //       if (decorationType)
      //         yield {
      //           decorationType,
      //           rangeOrOptions: lsp_Range__vscode_Range(r.range),
      //         }
      //     }
      // }
    })
  }
}
