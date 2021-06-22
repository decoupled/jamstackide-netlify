import React from "react"
import { memo } from "@decoupled/xlib"
import * as api from "../../../api/netlify_api"
import { AccountSettings_PaymentMethods_Method } from "./AccountSettings_PaymentMethods_Method"
import { icon, observable, observer, TreeItem, makeObservable } from "./deps"

@observer
export class AccountSettings_PaymentMethods extends React.Component<{
  api: api.NetlifyAPIWrapper
}> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
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
