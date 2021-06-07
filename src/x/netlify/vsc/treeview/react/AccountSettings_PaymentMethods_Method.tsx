import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { icon, menu, None, observer, TreeItem } from "./deps"
import { menu_def_edit } from "./menus"

@observer
export class AccountSettings_PaymentMethods_Method extends React.Component<{
  data: api.PaymentMethod
}> {
  private menu_edit = menu(menu_def_edit, {
    edit: () => {
      vscode.env.openExternal(
        vscode.Uri.parse(
          // TODO: replace with user's URL. This is just for testing
          "https://app.netlify.com/teams/aldonline/billing/general#payment-information"
        )
      )
    },
  })
  render() {
    return (
      <TreeItem
        label={this.props.data.treeview_label}
        iconPath={icon("credit-card")}
        menu={this.menu_edit}
        collapsibleState={None}
      />
    )
  }
}
