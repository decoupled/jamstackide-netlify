import vscode from "vscode"
import { vscode_ } from "./vscode_"

type UriString = string
type FilePath = string
/**
 * will call either Uri.parse or Uri.file depending ona few heuristics
 * @param x
 */
export function vscode_Uri_smartParse(
  x: UriString | vscode.Uri | FilePath
): vscode.Uri {
  if (typeof x === "string") {
    if (x.includes("\\")) return vscode_().Uri.file(x)
    if (x.startsWith("/")) return vscode_().Uri.file(x)
    return vscode_().Uri.parse(x)
  }
  return x
}
