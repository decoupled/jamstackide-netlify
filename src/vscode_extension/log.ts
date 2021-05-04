import { memoize } from "lodash"
import * as vscode from "vscode"

export function log(str: string) {
  netlify_output().appendLine(str)
}

const netlify_output = memoize(() =>
  vscode.window.createOutputChannel("Netlify")
)
