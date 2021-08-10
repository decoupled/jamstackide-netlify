import { Singleton, VSCodeCommand } from "lambdragon"
import * as vscode from "vscode"
import { URLWatcher } from "x/http/URLWatcher"
import { CWD } from "../di/CWD"
import { NetlifyCLIPath } from "../NetlifyCLIPath"
import { netlify_ids } from "../util/netlify_ids"

const netlify_bin = "/Users/aldo/.nvm/versions/node/v14.4.0/bin/netlify"

/**
 *
 *
 *
 */
export class Debugging implements Singleton {
  constructor(private NetlifyCLIPath: NetlifyCLIPath, private cwd: CWD) {
    debug_cmd.register(async () => {
      await this.examples__netlify_functions_basic_1__fullstack()
    })
    debug_functions_cmd.register(async () => {
      await this.examples__netlify_functions_basic_1__functionsonly()
    })
    this.setupBreakpointsListener()
  }

  private async examples__netlify_functions_basic_1__functionsonly() {
    const serverConfig: vscode.DebugConfiguration = {
      name: "Debug (Only Functions)",
      type: "node",
      request: "launch",
      skipFiles: ["<node_internals>/**"],
      program: "${workspaceFolder}/node_modules/.bin/netlify",
      args: ["functions:serve"],
      console: "integratedTerminal",
    }
    // const serverConfig: vscode.DebugConfiguration = {
    //   type: "node",
    //   request: "launch",
    //   name: "Netlify Functions",
    //   skipFiles: ["<node_internals>/**"],
    //   // program: await this.NetlifyCLIPath.withFunctionsDebuggingSupport(),
    //   program: netlify_bin,
    //   args: ["functions:serve"],
    //   // args: ["functions:serve"],
    //   console: "integratedTerminal",
    // }

    await vscode.debug.startDebugging(undefined, serverConfig)
  }

  private async examples__netlify_functions_basic_1__fullstack() {
    const serverConfig: vscode.DebugConfiguration = {
      name: "Netlify Dev (Functions)",
      type: "node",
      request: "launch",
      skipFiles: ["<node_internals>/**"],
      program: "${workspaceFolder}/node_modules/.bin/netlify",
      args: ["dev", "--inspect"],
      console: "integratedTerminal",
      env: { BROWSER: "none" },
      // "serverReadyAction": {
      //   "pattern": "Server now ready on (https?://[\w:.-]+)",
      //   "uriFormat": "%s",
      //   "action": "debugWithChrome"
      // }
    }
    // const serverConfig: vscode.DebugConfiguration = {
    //   type: "node",
    //   request: "launch",
    //   name: "Netlify Dev",
    //   skipFiles: ["<node_internals>/**"],
    //   // program: await this.NetlifyCLIPath.withFunctionsDebuggingSupport(),
    //   program: netlify_bin,
    //   args: ["dev", "--inspect"],
    //   console: "integratedTerminal",
    //   // does this prevent browser from opening automatically?
    //   env: { BROWSER: "none" },
    //   // resolveSourceMapLocations: [
    //   //   // NOTE: your linter may think this property shouldn't be here
    //   //   // yet it works for finding the source maps
    //   //   "${workspaceFolder}/**",
    //   //   "!**/node_modules/**",
    //   // ],
    // }

    const url = `http://localhost:8888/`

    await vscode.debug.startDebugging(undefined, serverConfig)

    await new URLWatcher({
      url,
    }).waitForNextOK()

    const clientConfig: vscode.DebugConfiguration = {
      name: "Netlify Dev (Browser)",
      type: "chrome",
      request: "launch",
      url,
      webRoot: "${workspaceFolder}/public",
      // sourceMapPathOverrides: {
      //   "webpack:///*": "${workspaceRoot}/*",
      // },
    }

    await vscode.debug.startDebugging(undefined, clientConfig)
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
    const program = await this.NetlifyCLIPath.withFunctionsDebuggingSupport()
    const config: vscode.DebugConfiguration = {
      type: "node",
      request: "launch",
      name: "Netlify Functions",
      skipFiles: ["<node_internals>/**"],
      program,
      // args: ["functions:serve", "--inspect"],
      args: ["dev", "--inspect"],
      // /**
      //  * Netlify Dev starts several child processes, including frameworks like Gatsby, Next.js, etc.
      //  * We don't want to attach to those
      //  */
      // autoAttachChildProcesses: false,
    }
    await vscode.debug.startDebugging(undefined, config)
    // vscode.debug.onDidStartDebugSession((_e) => {})
    // vscode.debug.onDidTerminateDebugSession((_e) => {})
  }

  private async fullStackDebugging() {
    const clientConfig: vscode.DebugConfiguration = {
      name: "client: chrome",
      type: "chrome",
      request: "launch",
      url: "http://localhost:8888",
      webRoot: "${workspaceFolder}",
      sourceMapPathOverrides: {
        "webpack:///*": "${workspaceRoot}/*",
      },
    }
    const serverConfig: vscode.DebugConfiguration = {
      type: "node",
      request: "launch",
      name: "Netlify Dev",
      skipFiles: ["<node_internals>/**"],
      program: await this.NetlifyCLIPath.withFunctionsDebuggingSupport(),
      args: ["dev", "--inspect"],
    }
    await vscode.debug.startDebugging(undefined, serverConfig)
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

const example_config2 = {
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  version: "0.2.0",
  // ---- FULLSTACK NETLIFY DEV DEBUGGING ----
  // 1. Make sure "Caught Exceptions" is deactivated in your VS Code debugger
  // 2. Run 'Fullstack Debugging' from the debug interface
  // 3. A chrome browser window will open, however it may take a few seconds
  // before the server is ready and content is displayed.
  compounds: [
    {
      name: "Fullstack Debugging",
      configurations: ["netlify dev", "client: chrome"],
    },
  ],
  configurations: [
    {
      name: "client: chrome",
      type: "chrome",
      request: "launch",
      url: "http://localhost:8888",
      webRoot: "${workspaceFolder}",
      sourceMapPathOverrides: {
        "webpack:///*": "${workspaceRoot}/*",
      },
    },
    {
      name: "netlify dev",
      type: "node",
      request: "launch",
      skipFiles: ["<node_internals>/**"],
      program: "${workspaceFolder}/node_modules/.bin/netlify",
      args: ["dev", "--inspect"],
      resolveSourceMapLocations: [
        // NOTE: your linter may think this property shouldn't be here
        // yet it works for finding the source maps
        "${workspaceFolder}/**",
        "!**/node_modules/**",
      ],
    },
  ],
}

const debug_cmd = new VSCodeCommand({
  command: netlify_ids.netlify.commands.debug.$id,
  title: "Debug (Full Stack)",
  category: "Netlify",
})

const debug_functions_cmd = new VSCodeCommand({
  command: netlify_ids.netlify.commands.debug_functions.$id,
  title: "Debug (Only Functions)",
  category: "Netlify",
})
