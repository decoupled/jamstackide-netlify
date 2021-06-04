import vscode from "vscode"
import { netlify_vsc_treeview_react_activate } from "./netlify_vsc_treeview_react_activate"
export class ReactTreeviewW {
  constructor(ctx: vscode.ExtensionContext) {
    netlify_vsc_treeview_react_activate(ctx)
  }
}
