import { memo } from "@decoupled/xlib"
import { Singleton } from "lambdragon"
import React from "react"
import { experimental_enabled } from "src/vscode_extension/util/experimental_enabled"
import { when_clauses } from "src/vscode_extension/util/when_clauses"
import vscode from "vscode"
import { VSCodeView } from "lambdragon"
import { TreeItem_render } from "../deps"
import { netlify_viewContainer } from "../netlify_viewContainer"
import { RootUI } from "./RootUI"
import { treeview_workflow_id } from "./treeview_workflow_id"

export class TreeviewWorkflowW implements Singleton {
  constructor(private ctx: vscode.ExtensionContext) {
    if (experimental_enabled() && false) {
      this.render()
    }
  }
  @memo() private render() {
    return TreeItem_render(view_def.id, <RootUI ctx={this.ctx} />)
  }
}

const view_def = new VSCodeView({
  id: treeview_workflow_id,
  name: "Workflow",
  when: when_clauses.config_netlify_experimental_enable,
  _container: netlify_viewContainer,
})
