import vscode from "vscode"
import { Map_getOrCreate } from "src/x/Map/getOrCreate"

export interface vscode_TextEditor_setDecorations_pivot_Item {
  decorationType: vscode.TextEditorDecorationType
  rangeOrOptions: vscode.Range | vscode.DecorationOptions
}

export function vscode_TextEditor_setDecorations_pivot(
  editor: vscode.TextEditor,
  types: vscode.TextEditorDecorationType[],
  items: (vscode_TextEditor_setDecorations_pivot_Item | undefined)[]
) {
  const mm = new Map<
    vscode.TextEditorDecorationType,
    Set<vscode.DecorationOptions>
  >()
  for (const item of items) {
    if (!item) continue
    const { decorationType, rangeOrOptions } = item
    const options: vscode.DecorationOptions =
      rangeOrOptions instanceof vscode.Range
        ? { range: rangeOrOptions }
        : rangeOrOptions
    Map_getOrCreate(mm, decorationType, () => new Set()).add(options)
  }
  for (const [k, v] of mm) {
    editor.setDecorations(k, Array.from(v))
  }
  for (const type of types) {
    if (!mm.has(type)) editor.setDecorations(type, [])
  }
}
