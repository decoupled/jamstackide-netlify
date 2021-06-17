import { vscode_languages_SmartDiagnosticsCollection } from "@decoupled/xlib"
import { readFileSync } from "fs-extra"
import { basename } from "path"
import * as vscode from "vscode"
import { netlify_toml_validator_get_diagnostics } from "./netlify_toml_validator"

export async function netlify_toml_validator_vsc(ctx: vscode.ExtensionContext) {
  const w = vscode.workspace.createFileSystemWatcher("**/netlify.toml")
  vscode.workspace
    .findFiles("**/netlify.toml")
    .then((files) => files.forEach((file) => refreshDiagnostics(file)))

  w.onDidChange(refreshDiagnostics)
  w.onDidCreate(refreshDiagnostics)
  ctx.subscriptions.push(w)

  const diagnosticCollection = vscode_languages_SmartDiagnosticsCollection(
    "netlify-toml-diagnostics"
  )

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (basename(event.document.fileName) === "netlify.toml")
      refreshDiagnostics(event.document.uri, event.document.getText())
  }, ctx.subscriptions)

  function refreshDiagnostics(
    netlifyTomlPath: vscode.Uri,
    configString?: string
  ) {
    if (typeof configString === "undefined") {
      configString = readFileSync(netlifyTomlPath.fsPath).toString()
    }

    const diagnostics = netlify_toml_validator_get_diagnostics(configString)
    diagnosticCollection.set(netlifyTomlPath, diagnostics)
  }
}
