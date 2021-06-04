import * as React from "react"
import * as vscode from "vscode"
import { TreeItem_render as render } from "lambdragon"
import { NetlifyUI } from "./netlify_vsc_treeview_react"

export const treeview_id = "decoupled.studio.netlify.treeview.react"

export const enableKey = "d_netlifyReactEnable"

export function ___buildmeta___() {
  return {
    pjson: {
      contributes: {
        views: {
          "netlify-view-container": [
            {
              id: treeview_id,
              name: "Netlify",
              // when: netlify_vsc_treeview_context_netlifyEnable,
            },
          ],
        },
      },
    },
  }
}

export function netlify_vsc_treeview_react_activate(
  ctx: vscode.ExtensionContext
) {
  render(treeview_id, <NetlifyUI ctx={ctx} />)
}

export function deactivate() {}
