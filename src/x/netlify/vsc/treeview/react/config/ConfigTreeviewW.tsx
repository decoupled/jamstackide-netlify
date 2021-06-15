import { TreeItem_render } from "lambdragon"
import * as React from "react"
import { ConfigRoot } from "./ConfigRoot"
import { netlify_vsc_treeview_config_id } from "./treeview_id"
import vscode from "vscode"
import { computed, reaction } from "mobx"
import { vscode_mobx } from "x/vscode/vscode_mobx"
import { NetlifyCLIWrapper } from "src/vscode_extension/NetlifyCLIWrapper"
import { Main } from "./main"
export class ConfigTreeviewW {
  constructor(ctx: vscode.ExtensionContext, cli: NetlifyCLIWrapper) {
    const root = <ConfigRoot ctx={ctx} cli={cli} />
    const root2 = <Main ctx={ctx} cli={cli} />
    const tree = TreeItem_render(netlify_vsc_treeview_config_id, root2)
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
