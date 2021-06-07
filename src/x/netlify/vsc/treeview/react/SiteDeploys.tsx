import { TreeItem } from "lambdragon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { SiteDeploy } from "./SiteDeploy"

@observer
export class SiteDeploys extends React.Component<{ site: api.NetlifySite }> {
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
