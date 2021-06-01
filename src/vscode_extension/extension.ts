import { VSCodeExtension } from "lambdragon"
import { join } from "path"
import { language_server_build_target } from "src/language_server/language_server"
import { headers_file_vsc } from "src/x/netlify/headers_file/headers_file_vsc"
import { redirects_file_vsc } from "src/x/netlify/redirects_file/redirects_file_vsc"
// import { netlify_toml_validator_vsc } from "src/x/toml/netlify_toml_validator_vsc"
import vscode from "vscode"
import merge from "webpack-merge"
import {
  commands_create_function,
  commands_create_function_contributes,
} from "./commands/create_function"
import { NetlifyLSPClientManager } from "./lsp_client/NetlifyLSPClientManager"
import { miniserver_init } from "./miniserver"
import icon from "./static/netlify_logomark.svg"
import {
  treeview_docs_activate,
  treeview_docs_contributes,
} from "./treeview/docs/treeview_docs"
import {
  treeview_etc_activate,
  treeview_etc_contributes,
} from "./treeview/etc/treeview_etc"

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
})

// the entrypoint
function main() {
  return {
    activate(ctx: vscode.ExtensionContext) {
      miniserver_init(ctx)
      treeview_docs_activate(ctx)
      treeview_etc_activate(ctx)
      // netlify_toml_validator_vsc(ctx)
      headers_file_vsc(ctx)
      redirects_file_vsc(ctx)
      commands_create_function(ctx)
      new NetlifyLSPClientManager(ctx)
      const hello = "hello"
      console.log(hello + " Marco")
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
    treeview_etc_contributes().contributes,
    {
      viewsContainers: {
        activitybar: [
          {
            id: "netlify",
            title: "Netlify",
            icon: "assets/icons2/netlify.svg",
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
