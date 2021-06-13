import { TreeItem_render } from "lambdragon"
import * as React from "react"
import { ConfigRoot } from "./ConfigRoot"
import { netlify_vsc_treeview_config_id } from "./treeview_id"
import vscode from "vscode"
import { computed, reaction } from "mobx"
import { vscode_mobx } from "x/vscode/vscode_mobx"

export class ConfigTreeviewW {
  constructor(ctx: vscode.ExtensionContext) {
    const root = <ConfigRoot ctx={ctx} />
    const tree = TreeItem_render(netlify_vsc_treeview_config_id, root)
    reaction(
      () => this.active_netlify_toml_doc,
      (doc) => {
        if (doc) tree.reveal()
      },
      { fireImmediately: true }
    )
  }

  @computed private get active_netlify_toml_doc() {
    const doc = vscode_mobx().activeTextEditor$$?.document
    if (!doc?.fileName?.endsWith("netlify.toml")) return undefined
    return doc
  }
}
