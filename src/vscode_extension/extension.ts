import { VSCodeExtension } from "lambdragon"
import { join } from "path"
import { language_server_build_target } from "src/language_server/language_server"
// import { netlify_toml_validator_vsc } from "src/x/toml/netlify_toml_validator_vsc"
import vscode from "vscode"
import merge from "webpack-merge"
import { netlify_vsc_treeview_react_contributes } from "x/netlify/vsc/treeview/react/netlify_vsc_treeview_react_contributes"
import { commands_create_function_contributes } from "./commands/CreateFunctionCommand"
import { autowire } from "./di/autowire"
import { VSCodeProjectW } from "./di/VSCodeProjectW"
import { NetlifyCLIPath_createDevTime } from "./NetlifyCLIPath"
import icon from "./static/netlify_logomark.svg"
import { treeview_docs_contributes } from "./treeview/docs/TreeviewDocsW"
import { treeview_etc_contributes } from "./treeview/etc/treeview_etc"

/**
 * we'll publish under a codename for now
 */
const CODENAME = "n2021"

// the build target for the extension
export const netlify_vscode_extension_build_target = new VSCodeExtension({
  main,
  activationEvents: ["*"],
  publisher: "decoupled",
  name: CODENAME,
  version: "0.0.1",
  displayName: CODENAME,
  description: CODENAME,
  categories: ["Other"],
  icon,
  contributes: contributes() as any,
  engines: { vscode: "^1.53.0" },
  deps: [language_server_build_target],
  staticDir: join(__dirname, "static"),
  extensionDependencies: ["auchenberg.vscode-browser-preview"],
})

// the entrypoint
function main() {
  return {
    activate(ctx: vscode.ExtensionContext) {
      for (const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
        // use lambdragon's "autowire" to create an instance of VSCodeProjectW
        // it will "inject" all dependencies, transitively
        autowire<VSCodeProjectW>(
          ctx,
          workspaceFolder,
          NetlifyCLIPath_createDevTime()
        )
        return // TODO: support more workspaces
      }
      // netlify_toml_validator_vsc(ctx)
    },
    deactivate() {},
  }
}

function contributes() {
  return merge([
    // commands_contributes().contributes,
    // treeview_workflow_contributes().contributes,
    commands_create_function_contributes().contributes,
    treeview_docs_contributes().contributes,
    netlify_vsc_treeview_react_contributes().contributes,
    // treeview_etc_contributes().contributes,
    {
      viewsContainers: {
        activitybar: [
          {
            id: "netlify",
            title: "Netlify",
            icon: "netlify_logomark.svg",
          },
        ],
      },
      languages: [
        {
          id: "netlifyredirects",
          // "extensions": [".py"],
          aliases: ["Netlify Redirects File"],
          filenames: ["_redirects"],
          // "configuration": "./language-configuration.json"
        },
        {
          id: "netlifyheaders",
          // "extensions": [".py"],
          aliases: ["Netlify Headers File"],
          filenames: ["_headers"],
          // "configuration": "./language-configuration.json"
        },
      ],
    },
  ])
}
