import { TreeItem } from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { Accounts } from "./Accounts"

@observer
export class Root extends React.Component<{
  getAPI: () => api.NetlifyAPIWrapper | undefined
  login: () => void
  logout: () => void
  netlifyIconPath: vscode.Uri
}> {
  render() {
    return (
      <TreeItem
        label="netlify accounts"
        collapsibleState={vscode.TreeItemCollapsibleState.Expanded}
        iconPath={this.props.netlifyIconPath}
      >
        <Accounts {...this.props} />
      </TreeItem>
    )
  }
}
