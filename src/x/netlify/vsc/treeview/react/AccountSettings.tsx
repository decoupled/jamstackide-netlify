import { TreeItem } from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { AccountSettings_PaymentMethods } from "./AccountSettings_PaymentMethods"

@observer
export class AccountSettings extends React.Component<{
  api: api.NetlifyAPIWrapper
}> {
  render() {
    return (
      <TreeItem
        label="account settings"
        iconPath={icon("account")}
        collapsibleState={vscode.TreeItemCollapsibleState.Collapsed}
      >
        <AccountSettings_PaymentMethods api={this.props.api} />
      </TreeItem>
    )
  }
}
