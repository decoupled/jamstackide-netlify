import * as vscode from "vscode"
import { wait } from "../../Promise/wait"
import { netlify_vsc_commands } from "./netlify_vsc_commands"
import { netlify_vsc_command_deploy_activate } from "./netlify_vsc_command_deploy"
import { netlify_vsc_oauth } from "./netlify_vsc_oauth"
import { netlify_vsc_oauth_manager } from "./netlify_vsc_oauth_manager"
import { netlify_vsc_pjson } from "./netlify_vsc_pjson"
//import { netlify_vsc_treeview_activate } from "./treeview/netlify_vsc_treeview"
import { netlify_vsc_treeview_react_activate } from "./treeview/react/netlify_vsc_treeview_react_activate"
import { netlify_vsc_filesystemprovider } from "./netlify_vsc_filesystemprovider"
import { netlify_vsc_statusbar } from "./netlify_vsc_statusbar"

export function ___buildmeta___() {
  return { pjson: netlify_vsc_pjson() }
}

export function netlify_vsc(ctx: vscode.ExtensionContext) {
  // netlifytoml_vsc()
  //netlify_vsc_treeview_activate(ctx)
  netlify_vsc_oauth(ctx)
  netlify_vsc_command_deploy_activate(ctx)
  netlify_vsc_treeview_react_activate(ctx)
  // develop_locally_command_activate(ctx)
  netlify_vsc_filesystemprovider(ctx)
  netlify_vsc_statusbar(ctx)

  vscode.commands.registerCommand(netlify_vsc_commands.exec.command, (func) => {
    func()
  })

  vscode.commands.registerCommand(netlify_vsc_commands.login.command, () => {
    netlify_vsc_oauth_manager(ctx).login()
  })

  vscode.commands.registerCommand(netlify_vsc_commands.logout.command, () => {
    netlify_vsc_oauth_manager(ctx).logout()
  })

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
            startDebugSession()
          }
          return
        }
      }
    }
  })

  async function startDebugSession() {
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
      /**
       * Netlify Dev starts several child processes, including frameworks like Gatsby, Next.js, etc.
       * We don't want to attach to those
       */
      autoAttachChildProcesses: false,
    }

    const dd = await vscode.debug.startDebugging(undefined, debugConfig)
  }

  vscode.commands.registerCommand(
    netlify_vsc_commands.debug.command,
    async () => {
      await startDebugSession()
    }
  )

  vscode.commands.registerCommand(
    netlify_vsc_commands.register_domain.command,
    async () => {
      vscode.window.showInformationMessage("TODO")
      return
      const register_new: vscode.QuickPickItem = {
        label: "buy new domain",
        picked: true,
      }

      const use_existing: vscode.QuickPickItem = {
        label: "use existing domain",
      }
      const res = await vscode.window.showQuickPick([
        register_new,
        use_existing,
      ])
      if (res === register_new) {
        const domain_search_value = await vscode.window.showInputBox({
          placeHolder: "mydomain.com",
          prompt: `enter domain name to see if it is available`,
        })
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "$(git-merge) searching for domain",
          },
          async () => {
            await wait(3000)
          }
        )
        const opt1: vscode.QuickPickItem = {
          label: "buy domain for $10 and link it to this site",
        }
        const opt2: vscode.QuickPickItem = {
          label: "keep searching...",
        }
        const res2 = await vscode.window.showQuickPick([opt1, opt2], {
          placeHolder: `Good news! The domain "${domain_search_value}" is available`,
        })
        vscode.window.showInformationMessage(
          `this domain is available! you can add it for $10`
        )
      }
    }
  )
}
