import React from "react"
import * as api from "../../../api/netlify_api"
import { AccountSettings_PaymentMethods } from "./AccountSettings_PaymentMethods"
import { icon, observer, TreeItem, Collapsed } from "./deps"

@observer
export class AccountSettings extends React.Component<{
  api: api.NetlifyAPIWrapper
}> {
  render() {
    return (
      <TreeItem
        label="account settings"
        iconPath={icon("account")}
        collapsibleState={Collapsed}
      >
        <AccountSettings_PaymentMethods api={this.props.api} />
      </TreeItem>
    )
  }
}
