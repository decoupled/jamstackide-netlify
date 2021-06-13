import {
  ensureDirSync,
  existsSync,
  outputJSONSync,
  readJSONSync,
} from "fs-extra"
import { join } from "path"
import vscode from "vscode"
import { Command } from "vscode-languageserver-types"

export function init_hook_activate() {
  init_hook_run_all()
}

function init_hook_run_all() {
  for (const wf of vscode.workspace.workspaceFolders ?? []) {
    const cmd = init_hook_get(wf.uri.fsPath)
    if (cmd)
      vscode.commands.executeCommand(cmd.command, ...(cmd.arguments ?? []))
  }
}

export function init_hook_set(dir: string, cmd: Command) {
  ensureDirSync(dir)
  outputJSONSync(init_hook_filename(dir), cmd)
}

function init_hook_get(dir: string, andInvalidate = true): Command | undefined {
  const ff = init_hook_filename(dir)
  if (!existsSync(ff)) return
  const cmd: Command = readJSONSync(ff)
  if (!Command.is(cmd)) return
  if (andInvalidate) outputJSONSync(ff, {}) // unlinking can be unsafe
  return cmd
}

export async function init_hook_set_and_open(
  dir: string,
  cmd: Command,
  openInNewWindow = false
) {
  init_hook_set(dir, cmd)
  const uri = vscode.Uri.file(dir)
  await vscode.commands.executeCommand(
    "vscode.openFolder",
    uri,
    openInNewWindow
  )
  if (!openInNewWindow) {
    // if we opened in the same window, reload so the init hook gets processed
    vscode.commands.executeCommand("workbench.action.reloadWindow")
  }
}

function init_hook_filename(dir: string) {
  return join(dir, ".netlify/vscode-extension/init")
}
