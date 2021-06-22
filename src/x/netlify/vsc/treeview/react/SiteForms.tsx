import { memo } from "@decoupled/xlib"
import React from "react"
import * as api from "../../../api/netlify_api"
import { icon, observable, observer, TreeItem, makeObservable } from "./deps"
import { SiteForm } from "./SiteForm"

@observer
export class SiteForms extends React.Component<{ site: api.NetlifySite }> {
  @observable data: api.NetlifySiteForm[] = []
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @memo() async fetch() {
    this.data = await this.props.site.forms()
  }
  render() {
    return (
      <TreeItem label="forms" iconPath={icon("feedback")}>
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteForm key={x.name} data={x} />)
        }}
      </TreeItem>
    )
  }
}
