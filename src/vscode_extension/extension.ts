import { VSCodeExtension } from "lambdragon"
import { join } from "path"
import { language_server_build_target } from "src/language_server/language_server"
import vscode from "vscode"
import merge from "webpack-merge"
import { commands_create_function_contributes } from "./commands/CreateFunctionCommand"
import { right_click_commands_contributes } from "./commands/RightClickCommands"
import { configuration_contributes } from "./configuration/contributes"
import { debugging_contributes } from "./debugging/contributes"
import { develop_locally_contributes } from "./dev/contributes"
import { autowire } from "./di/autowire"
import { VSCodeProjectW } from "./di/VSCodeProjectW"
import {
  NetlifyCLIPath_createDevTime,
  NetlifyCLIPath_createForExtension,
} from "./NetlifyCLIPath"
import icon from "./static/netlify_vscode_logo.png"
import { treeview_contributes } from "./treeview/contributes"
import { VERSION } from "./VERSION"
import { configure } from "mobx"

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
  version: VERSION,
  displayName: CODENAME,
  description: CODENAME,
  categories: ["Other"],
  icon,
  repository: "https://github.com/netlify/project-vscode-extension",
  contributes: contributes() as any,
  engines: { vscode: "^1.53.0" },
  deps: [language_server_build_target],
  staticDir: join(__dirname, "static"),
  extensionDependencies: [
    "auchenberg.vscode-browser-preview",
    "tamasfe.even-better-toml",
  ],
})

const USE_LOCAL_CLI = false

// the entrypoint
function main() {
  return {
    async activate(ctx: vscode.ExtensionContext) {
      configure({ enforceActions: "never" })
      const clipath = USE_LOCAL_CLI
        ? NetlifyCLIPath_createDevTime()
        : NetlifyCLIPath_createForExtension(ctx)
      for (const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
        // use lambdragon's "autowire" to create an instance of VSCodeProjectW
        // it will "inject" all dependencies, transitively
        autowire<VSCodeProjectW>(
          ctx,
          workspaceFolder,
          // NetlifyCLIPath_createDevTime()
          clipath
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
    treeview_contributes(),
    commands_create_function_contributes(),
    develop_locally_contributes(),
    debugging_contributes(),
    {
      languages: [
        {
          id: "netlifyredirects",
          aliases: ["Netlify Redirects File"],
          filenames: ["_redirects"],
          // "configuration": "./language-configuration.json"
        },
        {
          id: "netlifyheaders",
          aliases: ["Netlify Headers File"],
          filenames: ["_headers"],
          // "configuration": "./language-configuration.json"
        },
      ],
    },
    right_click_commands_contributes(),
    configuration_contributes(),
  ])
}
