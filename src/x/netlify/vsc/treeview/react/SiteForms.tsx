import { TreeItem } from "lambdragon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import { memo } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { SiteForm } from "./SiteForm"

@observer
export class SiteForms extends React.Component<{ site: api.NetlifySite }> {
  @observable data: api.NetlifySiteForm[] = []
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
