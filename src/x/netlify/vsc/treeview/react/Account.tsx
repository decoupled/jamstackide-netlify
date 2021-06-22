import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { AccountSettings } from "./AccountSettings"
import {
  Expanded,
  icon,
  makeObservable,
  observable,
  observer,
  TreeItem,
} from "./deps"
import { menu_def_logged_in } from "./menus"
import { Sites } from "./Sites"
@observer
export class Account extends React.Component<{
  api: api.NetlifyAPIWrapper
  logout: () => void
  ctx: vscode.ExtensionContext
}> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable label: string | undefined
  async componentDidMount() {
    const u = await this.props.api.getCurrentUser()
    this.label = `${u.slug} (${u.full_name})`
  }
  private menu_logged_in = menu_def_logged_in.create({
    logout: this.props.logout,
    logout2: this.props.logout,
  })
  render() {
    return (
      <TreeItem
        label={this.label ?? "fetching account details..."}
        iconPath={icon("account")}
        menu={this.menu_logged_in}
        collapsibleState={Expanded}
      >
        <Sites api={this.props.api} ctx={this.props.ctx} />
        <AccountSettings api={this.props.api} />
      </TreeItem>
    )
  }
}
