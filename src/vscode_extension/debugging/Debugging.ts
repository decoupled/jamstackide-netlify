import * as vscode from "vscode"
import { netlify_vsc_commands } from "x/netlify/vsc/netlify_vsc_commands"
import { NetlifyCLIPath } from "../NetlifyCLIPath"

export class Debugging {
  constructor(private NetlifyCLIPath: NetlifyCLIPath) {
    vscode.commands.registerCommand(
      netlify_vsc_commands.debug.command,
      async () => {
        await this.startDebugSession()
      }
    )
    this.setupBreakpointsListener()
  }

  private setupBreakpointsListener() {
    vscode.debug.onDidChangeBreakpoints(async (e) => {
      if (vscode.debug.activeDebugSession) return
      for (const ee of e.added) {
        if (ee instanceof vscode.SourceBreakpoint) {
          const isFunc = ee.location.uri.fsPath.includes("my_functions")
          if (isFunc) {
            const res = await vscode.window.showInformationMessage(
              "Start Netlify Dev in Debug Mode?",
              "Yes",
              "No"
            )
            if (res === "Yes") {
              this.startDebugSession()
            }
            return
          }
        }
      }
    })
  }

  async startDebugSession() {
    const args = ["functions:serve", "--port", "9998"]
    const debugConfig: vscode.DebugConfiguration = {
      type: "node",
      request: "launch",
      name: "Netlify Dev",
      skipFiles: ["<node_internals>/**"],
      program: await this.NetlifyCLIPath.withFunctionsDebuggingSupport(),
      args,
      // /**
      //  * Netlify Dev starts several child processes, including frameworks like Gatsby, Next.js, etc.
      //  * We don't want to attach to those
      //  */
      autoAttachChildProcesses: false,
    }
    await vscode.debug.startDebugging(undefined, debugConfig)
  }
}

/*
    async function startDebugSession_old() {
      const useBranch = true
      const pp1 = "/Users/aldo/com.github/netlify/cli/bin/run"
      const pp2 = "${workspaceFolder}/node_modules/.bin/netlify"
      const program = useBranch ? pp1 : pp2
      const args = useBranch ? ["functions:serve", "--port", "9998"] : ["dev"]
      const debugConfig: vscode.DebugConfiguration = {
        type: "node",
        request: "launch",
        name: "Netlify Dev",
        skipFiles: ["<node_internals>/**"],
        program,
        args,

         autoAttachChildProcesses: false,
        }
        const dd = await vscode.debug.startDebugging(undefined, debugConfig)
      }
*/
