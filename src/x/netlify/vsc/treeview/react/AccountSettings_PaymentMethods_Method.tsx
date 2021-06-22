import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { icon, None, observer, TreeItem } from "./deps"
import { menu_def_edit } from "./menus"

@observer
export class AccountSettings_PaymentMethods_Method extends React.Component<{
  data: api.PaymentMethod
}> {
  private menu_edit = menu_def_edit.create({
    edit: async () => {
      const url = await this.props.data.admin_url()
      vscode.env.openExternal(vscode.Uri.parse(url))
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
