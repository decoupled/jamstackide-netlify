import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { Account } from "./Account"
import { icon, observer, TreeItem, None } from "./deps"

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
        collapsibleState={None}
      />
    )
  }

  render__authenticating() {
    return (
      <TreeItem
        key="xx"
        label="authenticating with netlify..."
        iconPath={this.props.netlifyIconPath}
        collapsibleState={None}
      />
    )
  }

  render() {
    const api = this.props.getAPI()
    if (api) return <Account api={api} logout={this.props.logout} />
    return this.render__logged_out()
  }
}
