import React from "react"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { icon, menu, observable, observer, TreeItem } from "./deps"
import { menu_def_add } from "./menus"
import { SiteSnippet } from "./SiteSnippet"

@observer
export class SiteSnippets extends React.Component<{ site: api.NetlifySite }> {
  @observable data: api.NetlifySiteSnippet[] = []
  @memo() async fetch() {
    this.data = await this.props.site.snippets()
  }
  private snippets__menu = menu(menu_def_add, {
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
