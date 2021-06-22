import { memo } from "@decoupled/xlib"
import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { icon, makeObservable, observable, observer, TreeItem } from "./deps"
import { menu_def_sites } from "./menus"
import { Site } from "./Site"

@observer
export class Sites extends React.Component<{
  api: api.NetlifyAPIWrapper
  ctx: vscode.ExtensionContext
}> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable data: api.NetlifySite[] = []
  @memo() async fetch() {
    this.data = await this.props.api.sites()
  }
  private menu = menu_def_sites.create({
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
          return this.data.map((s) => (
            <Site site={s} key={s.id} ctx={this.props.ctx} />
          ))
        }}
      </TreeItem>
    )
  }
}
