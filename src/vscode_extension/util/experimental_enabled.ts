import vscode from "vscode"

export function experimental_enabled(): boolean {
  return (
    vscode.workspace.getConfiguration("netlify.experimental").get("enabled") ===
    true
  )
}
