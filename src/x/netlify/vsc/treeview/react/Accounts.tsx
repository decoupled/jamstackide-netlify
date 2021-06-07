import { TreeItem } from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { Account } from "./Account"

@observer
export class Accounts extends React.Component<{
  getAPI: () => api.NetlifyAPIWrapper | undefined
  login: () => void
  logout: () => void
  netlifyIconPath: vscode.Uri
}> {
  render__logged_out() {
    return (
      <TreeItem
        key="xx"
        label="click here to add account..."
        iconPath={icon("add")}
        select={this.props.login}
        collapsibleState={vscode.TreeItemCollapsibleState.None}
      />
    )
  }

  render__authenticating() {
    return (
      <TreeItem
        key="xx"
        label="authenticating with netlify..."
        iconPath={this.props.netlifyIconPath}
        collapsibleState={vscode.TreeItemCollapsibleState.None}
      />
    )
  }

  render() {
    const api = this.props.getAPI()
    if (api) return <Account api={api} logout={this.props.logout} />
    return this.render__logged_out()
  }
}
