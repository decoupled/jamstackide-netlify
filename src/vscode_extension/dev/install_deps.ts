import * as fs from "fs-extra"
import { join } from "path"
import vscode from "vscode"
import { npm__yarn__install_dry } from "x/npm__yarn/npm__yarn__install"
import { shell_wrapper_run_or_fail } from "x/vscode/Terminal/shell_wrapper/shell_wrapper_run"
import { vscode_window_createTerminal_andRun } from "x/vscode/vscode_window_createTerminal_andRun"
import { ExtraOpts } from "./types"

export async function install_deps(opts: {
  dir: string
  extraOpts?: ExtraOpts
}) {
  const cmds = await install_deps_dry(opts)
  if (!cmds) return false
  for (const cmd of cmds)
    await shell_wrapper_run_or_fail(cmd, (cmd) => {
      vscode_window_createTerminal_andRun({ cmd, cwd: opts.dir })
    })
  return true
}

async function install_deps_dry(opts: {
  dir: string
  extraOpts?: ExtraOpts
}): Promise<string[] | undefined> {
  const { extraOpts, dir } = opts
  if (extraOpts?.install) {
    const install_cmd = extraOpts.install
    // some known commands are whitelisted
    if (install_cmd === "bundle install") {
      // https://jekyllrb.com/tutorials/using-jekyll-with-bundler/
      // install dependencies locally to avoid permission issues
      // TODO: add this line to .gitignore
      return bundle_install_cmd()
    } else {
      vscode.window.showWarningMessage(
        `custom install commands not implemented yet: ${install_cmd}`
      )
      return
    }
  } else {
    // guess
    const gemfile = join(dir, "Gemfile")
    if (await fs.pathExists(gemfile)) {
      return bundle_install_cmd()
    }
    const npmi = await npm__yarn__install_dry(dir)
    return npmi ? [npmi] : undefined
  }
}

function bundle_install_cmd() {
  // TODO: check for bundle installation
  const line1 = `bundle config set --local path '.vendor/bundle'`
  const line2 = "bundle install"
  return [line1, line2]
}
