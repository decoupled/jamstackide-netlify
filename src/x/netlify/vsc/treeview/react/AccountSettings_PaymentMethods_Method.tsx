import {
  TreeItem,
  TreeItem_Menu_create as TreeItemMenu_create,
} from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { menu_def_edit } from "./menus"

@observer
export class AccountSettings_PaymentMethods_Method extends React.Component<{
  data: api.PaymentMethod
}> {
  private menu_edit = TreeItemMenu_create(menu_def_edit, {
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
        collapsibleState={vscode.TreeItemCollapsibleState.None}
      />
    )
  }
}
