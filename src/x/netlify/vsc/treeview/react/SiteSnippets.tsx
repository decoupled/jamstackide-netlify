import {
  TreeItem,
  TreeItem_Menu_create as TreeItemMenu_create,
} from "lambdragon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { menu_def_add } from "./menus"
import { SiteSnippet } from "./SiteSnippet"

@observer
export class SiteSnippets extends React.Component<{ site: api.NetlifySite }> {
  @observable data: api.NetlifySiteSnippet[] = []
  @memo() async fetch() {
    this.data = await this.props.site.snippets()
  }
  private snippets__menu = TreeItemMenu_create(menu_def_add, {
    add: () => {
      console.log("add snippet...")
    },
  })
  render() {
    return (
      <TreeItem
        label="snippets"
        iconPath={icon("code")}
        menu={this.snippets__menu}
      >
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteSnippet key={x.id} data={x} />)
        }}
      </TreeItem>
    )
  }
}
