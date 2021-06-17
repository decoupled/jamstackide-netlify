import { Singleton, TreeItem_render } from "lambdragon"
import React from "react"
import { experimental_enabled } from "src/vscode_extension/util/experimental_enabled"
import vscode from "vscode"
import { memo } from "@decoupled/xlib"
import { RootUI } from "./RootUI"
import { treeview_workflow_id } from "./treeview_workflow_id"

export class TreeviewWorkflowW implements Singleton {
  constructor(private ctx: vscode.ExtensionContext) {
    if (experimental_enabled()) {
      this.render()
    }
  }
  @memo() private render() {
    return TreeItem_render(treeview_workflow_id, <RootUI ctx={this.ctx} />)
  }
}
