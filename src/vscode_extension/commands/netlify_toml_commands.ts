import { LazyGetter as lazy } from "lazy-get-decorator"
import { values } from "lodash"
import { Memoize as memo } from "lodash-decorators"
import vscode from "vscode"
import { ts_findTSConfig } from "x/typescript/ts_findTSConfig"
import { vscode_window_createTerminal_andRun } from "x/vscode/vscode_window_createTerminal_andRun"
import { join, basename } from "path"

export function run_ts(ctx: vscode.ExtensionContext) {
  vscode.commands.registerCommand(commands.debug_ts.command, debug)
  vscode.commands.registerCommand(commands.run_ts.command, run)
  vscode.commands.registerCommand(commands.debug_js.command, debug)
  vscode.commands.registerCommand(commands.run_js.command, run)
  function run(uri: vscode.Uri) {
    new ActionsForTSFile(uri).run()
  }
  function debug(uri: vscode.Uri) {
    new ActionsForTSFile(uri).debug()
  }
}

export function ___buildmeta___() {
  return {
    pjson: {
      contributes: {
        commands: values(commands),
        menus: {
          "explorer/context": [
            {
              when: when_js,
              command: commands.debug_js.command,
              group: "7_modification",
            },
            {
              when: when_ts,
              command: commands.debug_ts.command,
              group: "7_modification",
            },
            {
              when: when_js,
              command: commands.run_js.command,
              group: "7_modification",
            },
            {
              when: when_ts,
              command: commands.run_ts.command,
              group: "7_modification",
            },
          ],
        },
      },
    },
  }
}

const when_js =
  "resourceLangId == javascript || resourceLangId == javascriptreact"

const when_ts =
  "resourceLangId == typescript || resourceLangId == typescriptreact"

const commands = {
  debug_js: {
    command: "decoupled.internal.debug_js",
    title: "[D] Debug JS",
  },
  run_js: {
    command: "decoupled.internal.run_js",
    title: "[D] Run JS",
  },
  debug_ts: {
    command: "decoupled.internal.debug_ts",
    title: "[D] Debug TS",
  },
  run_ts: {
    command: "decoupled.internal.run_ts",
    title: "[D] Run TS",
  },
}

class ActionsForTSFile {
  constructor(public uri: vscode.Uri) {}
  @memo() debug() {
    // TODO: this requires ts-node to be available
    const config: vscode.DebugConfiguration = {
      name: `debug ${basename(this.uri.fsPath)}`,
      type: "node",
      request: "launch",
      args: [this.uri.fsPath],
      runtimeArgs: ["-r", "ts-node/register", "--nolazy"],
      sourceMaps: true,
      cwd: this.cwd,
      protocol: "inspector",
      autoAttachChildProcesses: true,
      env: { TS_NODE_PROJECT: this.tsConfigFilePath },
    }
    vscode.debug.startDebugging(undefined, config)
  }
  @memo() run() {
    const ts_node_bin = join(this.cwd, "node_modules/.bin/ts-node")
    const cmd = `${ts_node_bin} -T ${this.uri.fsPath}`
    //const cmd = `node -r ts-node/register --nolazy ${this.uri.fsPath}`
    vscode_window_createTerminal_andRun({
      name: `run ${basename(this.uri.fsPath)}`,
      cwd: this.cwd,
      cmd,
      env: { TS_NODE_PROJECT: this.tsConfigFilePath },
    })
  }
  @lazy() get wf() {
    const x = vscode.workspace.getWorkspaceFolder(this.uri)
    if (!x) throw new Error("could not determine workspace folder")
    return x
  }
  @lazy() get tsConfigFilePath() {
    const x = ts_findTSConfig(this.uri.fsPath)
    if (!x) throw new Error("tsconfig.json not found")
    return x
  }
  @lazy() get cwd() {
    return this.wf.uri.fsPath
  }
}
