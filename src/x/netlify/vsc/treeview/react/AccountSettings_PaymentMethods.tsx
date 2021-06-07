import { TreeItem } from "lambdragon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { AccountSettings_PaymentMethods_Method } from "./AccountSettings_PaymentMethods_Method"

@observer
export class AccountSettings_PaymentMethods extends React.Component<{
  api: api.NetlifyAPIWrapper
}> {
  @observable data: api.PaymentMethod[] = []
  @memo() async fetch() {
    this.data = await this.props.api.paymentMethods()
  }
  render() {
    return (
      <TreeItem label="payment methods" iconPath={icon("credit-card")}>
        {() => {
          this.fetch()
          return this.data.map((s, i) => (
            <AccountSettings_PaymentMethods_Method key={i} data={s} />
          ))
        }}
      </TreeItem>
    )
  }
}
