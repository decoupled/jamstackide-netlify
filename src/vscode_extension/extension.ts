import { VSCodeExtension } from "lambdragon"
import { values } from "lodash"
import { join } from "path"
import { language_server_build_target } from "src/language_server/language_server"
import vscode from "vscode"
import merge from "webpack-merge"
import { commands_create_function_contributes } from "./commands/CreateFunctionCommand"
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
import { when_clauses } from "./util/when_clauses"
import { VERSION } from "./VERSION"

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

{
  commands_contributes()
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
    commands_contributes(),
    configuration_contributes(),
  ])
}

// https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups
function commands_contributes() {
  function cc(group: string) {
    return [
      ...netlify_toml_commands().map((cmd) => {
        return {
          when: when_clauses.is_netlify_toml,
          command: cmd.command,
          group,
        }
      }),
      ...headers_commands().map((cmd) => {
        return {
          when: when_clauses.is_headers,
          command: cmd.command,
          group,
        }
      }),
      ...redirects_commands().map((cmd) => {
        return {
          when: when_clauses.is_redirects,
          command: cmd.command,
          group,
        }
      }),
    ]
  }
  return {
    menus: {
      "explorer/context": [...cc("2_netlify")],
      "editor/context": [...cc("2_netlify")],
    },
    commands: values(command_ids),
  }
}

function netlify_toml_commands() {
  return values(command_ids)
}

function headers_commands() {
  return [command_ids.add_custom_header]
}

function redirects_commands() {
  return [command_ids.add_redirect]
}

const command_ids = {
  add_redirect: {
    command: "netlify.add_redirect",
    title: "Add Redirect",
    category: "Netlify",
  },
  add_context: {
    command: "netlify.add_context",
    title: "Add Context",
    category: "Netlify",
  },
  add_custom_header: {
    command: "netlify.add_custom_header",
    title: "Add Custom Header",
    category: "Netlify",
  },
  add_edge_handler: {
    command: "netlify.add_edge_handler",
    title: "Add Edge Handler",
    category: "Netlify",
  },
}
