import React from "react"
import { memo } from "@decoupled/xlib"
import * as api from "../../../api/netlify_api"
import { icon, observable, observer, TreeItem, makeObservable } from "./deps"
import { menu_def_add } from "./menus"
import { SiteSnippet } from "./SiteSnippet"

@observer
export class SiteSnippets extends React.Component<{ site: api.NetlifySite }> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable data: api.NetlifySiteSnippet[] = []
  @memo() async fetch() {
    this.data = await this.props.site.snippets()
  }
  private snippets__menu = menu_def_add.create({
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
