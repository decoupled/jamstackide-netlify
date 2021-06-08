import { Singleton, TreeItem_render } from "lambdragon"
import React from "react"
import { memo } from "src/x/decorators"
import vscode from "vscode"
import { RootUI } from "./RootUI"
import { treeview_workflow_id } from "./treeview_workflow_id"

export class TreeviewWorkflowW implements Singleton {
  constructor(private ctx: vscode.ExtensionContext) {
    this.render()
  }
  @memo() private render() {
    return TreeItem_render(treeview_workflow_id, <RootUI ctx={this.ctx} />)
  }
}
