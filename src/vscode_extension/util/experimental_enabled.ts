import vscode from "vscode"
import { netlify_ids } from "./netlify_ids"

export function experimental_enabled(): boolean {
  return (
    vscode.workspace
      .getConfiguration()
      .get(netlify_ids.netlify.experimental.enabled.$id) === true
  )
}
