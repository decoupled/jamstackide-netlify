import { NetlifyLSPClientBuffer } from "src/vscode_extension/lsp_client/NetlifyLSPClientBuffer"
import vscode from "vscode"
import { treeview_outline_setup } from "./treeview_outline_setup"

export class TreeviewOutlineW {
  constructor(ctx: vscode.ExtensionContext, client: NetlifyLSPClientBuffer) {
    let d: vscode.Disposable | undefined
    client.onClientChanged.event((c) => {
      d?.dispose()
      d = treeview_outline_setup(ctx, c)
    })
  }
}
