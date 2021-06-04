import { join } from "path"
import vscode from "vscode"

export function vsc_assets_icon(name: string) {
  return `assets/icons2/${name}.svg`
}

export function vsc_assets_icon_uri(
  name: string,
  ctx: vscode.ExtensionContext
) {
  const pp = join(ctx.extensionPath, vsc_assets_icon(name))
  return vscode.Uri.file(pp)
}
