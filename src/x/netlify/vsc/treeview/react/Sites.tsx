import {
  TreeItem,
  TreeItem_Menu_create as TreeItemMenu_create,
} from "lambdragon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { menu_def_sites } from "./menus"
import { Site } from "./Site"

@observer
export class Sites extends React.Component<{
  api: api.NetlifyAPIWrapper
}> {
  @observable data: api.NetlifySite[] = []
  @memo() async fetch() {
    this.data = await this.props.api.sites()
  }
  private menu = TreeItemMenu_create(menu_def_sites, {
    add: () => {
      vscode.window.showInformationMessage("add")
    },
    search: () => {
      vscode.window.showInformationMessage("search")
    },
  })
  render() {
    return (
      <TreeItem label="sites" iconPath={icon("browser")} menu={this.menu}>
        {() => {
          this.fetch()
          return this.data.map((s) => <Site site={s} key={s.id} />)
        }}
      </TreeItem>
    )
  }
}