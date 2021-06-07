import React from "react"
import * as api from "../../../api/netlify_api"
import { icon, None, observer, TreeItem } from "./deps"

@observer
export class SiteForm extends React.Component<{ data: api.NetlifySiteForm }> {
  render() {
    const f = this.props.data
    return (
      <TreeItem
        label={f.treeview_label}
        description={f.treeview_description}
        iconPath={icon("feedback")}
      >
        <TreeItem
          label="download as json"
          iconPath={icon("desktop-download")}
          collapsibleState={None}
        ></TreeItem>
        <TreeItem
          label="download as csv"
          iconPath={icon("desktop-download")}
          collapsibleState={None}
        ></TreeItem>
        {/* <TreeItem label="submissions..."></TreeItem> */}
      </TreeItem>
    )
  }
}
