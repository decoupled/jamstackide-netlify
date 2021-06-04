import * as React from "react"
import * as vscode from "vscode"
import { TreeItem_render } from "lambdragon"
import { NetlifyUI } from "./netlify_vsc_treeview_react"
import { netlify_vsc_treeview_react_id } from "./netlify_vsc_treeview_react_id"

export const enableKey = "d_netlifyReactEnable"

export function netlify_vsc_treeview_react_activate(
  ctx: vscode.ExtensionContext
) {
  TreeItem_render(netlify_vsc_treeview_react_id, <NetlifyUI ctx={ctx} />)
}
