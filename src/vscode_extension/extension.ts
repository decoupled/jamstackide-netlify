import { VSCodeExtension } from "lambdragon"
import { join } from "path"
import { headers_file_vsc } from "src/x/netlify/headers_file/headers_file_vsc"
import { netlify_toml_validator_vsc } from "src/x/toml/netlify_toml_validator_vsc"
import vscode from "vscode"
import merge from "webpack-merge"
import icon from "./static/netlify_logomark.svg"
import {
  treeview_docs_activate,
  treeview_docs_contributes,
} from "./treeview/docs/treeview_docs"

/**
 * we'll publish under a codename for now
 */
const CODENAME = "n2021"

// the build target for the extension
export const netlify_vscode_extension = new VSCodeExtension({
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
  staticDir: join(__dirname, "static"),
})

// the entrypoint
function main() {
  return {
    activate(ctx: vscode.ExtensionContext) {
      treeview_docs_activate(ctx)
      netlify_toml_validator_vsc(ctx)
      headers_file_vsc(ctx)
    },
    deactivate() {},
  }
}

function contributes() {
  return merge([
    // commands_contributes().contributes,
    // treeview_workflow_contributes().contributes,
    treeview_docs_contributes().contributes,
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
    },
  ])
}
