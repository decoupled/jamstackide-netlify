import { memo } from "@decoupled/xlib"
import React from "react"
import * as api from "../../../api/netlify_api"
import { icon, makeObservable, observable, observer, TreeItem } from "./deps"
import { SiteDeploy } from "./SiteDeploy"

@observer
export class SiteDeploys extends React.Component<{ site: api.NetlifySite }> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable data: api.NetlifySiteDeploy[] = []
  @memo() async fetch() {
    this.data = await this.props.site.deploys()
  }
  render() {
    return (
      <TreeItem label="deploys" iconPath={icon("versions")}>
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteDeploy key={x.id} data={x} />)
        }}
      </TreeItem>
    )
  }
}
