import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { Accounts } from "./Accounts"
import { Expanded, observer, TreeItem } from "./deps"

@observer
export class Root extends React.Component<{
  getAPI: () => api.NetlifyAPIWrapper | undefined
  login: () => void
  logout: () => void
  netlifyIconPath: vscode.Uri
  ctx: vscode.ExtensionContext
}> {
  render() {
    return (
      <TreeItem
        label="netlify accounts"
        collapsibleState={Expanded}
        iconPath={this.props.netlifyIconPath}
      >
        <Accounts {...this.props} />
      </TreeItem>
    )
  }
}
