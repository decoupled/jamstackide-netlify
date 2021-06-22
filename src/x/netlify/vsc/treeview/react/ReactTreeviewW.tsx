import { TreeItem_render } from "./deps"
import * as React from "react"
import { experimental_enabled } from "src/vscode_extension/util/experimental_enabled"
import vscode from "vscode"
import { NetlifyAPIWrapper } from "x/netlify/api/netlify_api"
import { NetlifyOAuthManager } from "../../NetlifyOAuthManager"
import { icon_uri } from "./icon_uri"
import { Root } from "./Root"
import { netlify_vsc_treeview_react_id } from "./treeview_id"

export class ReactTreeviewW {
  constructor(ctx: vscode.ExtensionContext, tokens: NetlifyOAuthManager) {
    if (experimental_enabled() && false) {
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
}
