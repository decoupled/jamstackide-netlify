import { lsp_Range__vscode_Range } from "src/x/lsp__vscode/lsp_Range__vscode_Range"
import {
  vscode_TextEditor_setDecorations_pivot,
  vscode_TextEditor_setDecorations_pivot_Item
} from "src/x/vscode/vscode_TextEditor_setDecorations_pivot"
import * as vscode from "vscode"
import { DecorationData_is } from "../etc/DecorationData"
import {
  vscode_decoration_types_all,
  vscode_decoration_types_find
} from "../etc/vscode_decoration_types"
import { vscode_TextEditor_watch } from "../etc/vscode_TextEditor_watch"
import { headers_file_autocomplete } from "./headers_file_autocomplete"
import { headers_file_parser } from "./headers_file_parser"

export class HeadersFileW {
  constructor(ctx: vscode.ExtensionContext) {
    headers_file_autocomplete(ctx)
    vscode_TextEditor_watch(ctx, "_headers", (editor) => {
      const src = editor.document.getText()
      const rest = headers_file_parser(src)
      vscode_TextEditor_setDecorations_pivot(
        editor,
        vscode_decoration_types_all(),
        Array.from(dddsss())
      )
      function* dddsss(): Generator<vscode_TextEditor_setDecorations_pivot_Item> {
        for (const r of rest)
          if (DecorationData_is(r)) {
            const decorationType = vscode_decoration_types_find(r.type)
            if (decorationType)
              yield {
                decorationType,
                rangeOrOptions: lsp_Range__vscode_Range(r.range),
              }
          }
      }
    })
  }
}
