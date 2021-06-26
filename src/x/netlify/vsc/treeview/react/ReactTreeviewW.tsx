import * as React from "react"
import { netlify_viewContainer } from "src/vscode_extension/treeview/netlify_viewContainer"
import { experimental_enabled } from "src/vscode_extension/util/experimental_enabled"
import { when_clauses } from "src/vscode_extension/util/when_clauses"
import vscode from "vscode"
import { NetlifyAPIWrapper } from "x/netlify/api/netlify_api"
import { VSCodeView } from "x/vscode/vscode_elms"
import { NetlifyOAuthManager } from "../../NetlifyOAuthManager"
import { TreeItem_render } from "./deps"
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
      const tree = TreeItem_render(view_def.id, root)
    }
  }
}

const view_def = new VSCodeView({
  id: netlify_vsc_treeview_react_id,
  name: "Accounts",
  when: when_clauses.config_netlify_experimental_enable,
  _container: netlify_viewContainer,
})
