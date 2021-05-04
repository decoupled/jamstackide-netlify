import { reaction } from "mobx"
import * as vscode from "vscode"
import { SerializableTreeDataProvider_build } from "src/x/vscode/TreeDataProvider/serializable/builder"
import { SerializableTreeDataProvider_to_vscode_TreeDataProvider } from "src/x/vscode/TreeDataProvider/serializable/SerializableTreeDataProvider_to_vscode_TreeDataProvider"
import { netlify_vsc_treeview_build } from "./netlify_vsc_treeview_build"
import {
  getContextValue,
  netlify_vsc_treeview_context_netlifyEnable,
  netlify_vsc_treeview_id,
} from "./netlify_vsc_treeview_consts"

export function netlify_vsc_treeview_activate(ctx: vscode.ExtensionContext) {
  reaction(
    () => "" /*redwood_toml_find$()*/,
    (f) => {
      vscode.commands.executeCommand(
        "setContext",
        netlify_vsc_treeview_context_netlifyEnable,
        typeof f === "string"
      )
    },
    { fireImmediately: true }
  )

  const stdp = SerializableTreeDataProvider_build(
    netlify_vsc_treeview_build,
    10000
  )
  const treeDataProvider = SerializableTreeDataProvider_to_vscode_TreeDataProvider(
    stdp,
    {
      getContextValue,
      ctx,
    }
  )
  const treeview = vscode.window.createTreeView(netlify_vsc_treeview_id, {
    treeDataProvider,
    showCollapseAll: true,
  })
}

export function deactivate() {}
