import { join } from "path"
import { fs_findAvailableDirAppendNumber } from "src/x/fs/fs_findAvailableDirAppendNumber"
import vscode from "vscode"
import { TargetDirSpec } from "./TargetDirSpec"

export async function TargetDirSpec_resolve_vsc({
  targetDir,
  autoNamePrefix,
}: {
  targetDir: TargetDirSpec
  autoNamePrefix: string
}) {
  if (targetDir.kind === "specific") return targetDir.dir
  if (targetDir.kind === "auto") {
    const ff = join(targetDir.defaultRootDir, autoNamePrefix)
    const fff = fs_findAvailableDirAppendNumber(ff)
    return fff
  }
  vscode.window.showWarningMessage("TODO: specify target=choose")
  return
  // const default_location: vscode.QuickPickItem = {
  //   label: `Clone repo to ~/${defaultProjectsFolderName} (recommended)`,
  //   picked: true,
  // }
  // const custom_location: vscode.QuickPickItem = {
  //   label: "Pick a different location...",
  // }
  // const items = [default_location, custom_location]
  // const result = await vscode.window.showQuickPick(items)
  // if (!result) {
  //   return
  // }
  // if (result === default_location) {
  //   return this.opts.defaultRootDir
  // }
  // // TODO: pick folder
  // vscode.window.showWarningMessage("TODO")
}
