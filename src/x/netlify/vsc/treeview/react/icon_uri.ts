import { join } from "path"
import vscode from "vscode"

function icon(name: string) {
  return `assets/icons2/${name}.svg`
}

export function icon_uri(name: string, ctx: vscode.ExtensionContext) {
  const pp = join(ctx.extensionPath, icon(name))
  return vscode.Uri.file(pp)
}
