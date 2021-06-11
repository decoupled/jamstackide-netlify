import { TreeItem_render } from "lambdragon"
import * as React from "react"
import vscode from "vscode"
import { NetlifyAPIWrapper } from "x/netlify/api/netlify_api"
import { NetlifyOAuthManager } from "../../NetlifyOAuthManager"
import { icon_uri } from "./icon_uri"
import { Root } from "./Root"
import { netlify_vsc_treeview_react_id } from "./treeview_id"

export class ReactTreeviewW {
  constructor(ctx: vscode.ExtensionContext, tokens: NetlifyOAuthManager) {
    const root = (
      <Root
        getAPI={() => {
          if (!tokens.token) return undefined
          return new NetlifyAPIWrapper(tokens.token)
        }}
        login={() => tokens.login()}
        logout={() => tokens.logout()}
        netlifyIconPath={icon_uri("netlify", ctx)}
        ctx={ctx}
      />
    )
    const tree = TreeItem_render(netlify_vsc_treeview_react_id, root)
  }
}
