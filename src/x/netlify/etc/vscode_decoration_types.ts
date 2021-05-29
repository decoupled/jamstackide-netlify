import { memoize, values } from "lodash"
import * as vscode from "vscode"
import { DecorationType } from "./DecorationData"

export const vscode_decoration_types_find = memoize(find)
export const vscode_decoration_types_all = memoize(all)

function find(t: DecorationType): vscode.TextEditorDecorationType | undefined {
  return create_memo()[t]
}

function all(): vscode.TextEditorDecorationType[] {
  return values(create_memo())
}

const create_memo = memoize(create)

function create() {
  const types = DecorationType
  const t = vscode.window.createTextEditorDecorationType
  const all = {
    [types.headers__comment]: t({
      color: "rgba(150,150,150,0.7)",
    }),
    [types.headers__header_value]: t({
      backgroundColor: "rgba(100,100,255,0.1)",
    }),
    [types.headers__path]: t({
      color: "rgba(180,230, 255,0.7)",
      before: {
        contentText: "🌎",
        color: "rgba(100,100, 255,0.5)",
      },
    }),
    [types.headers__header_name]: t({
      color: "rgba(100,100, 255,0.9)",
    }),
    [types.headers__punctuation]: t({
      color: "rgba(150,150,150,0.4)",
    }),
  }
  return all
}

const emojis = "🏀🌐🌎"
