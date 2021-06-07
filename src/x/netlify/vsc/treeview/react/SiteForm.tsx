import { TreeItem } from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"

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
          collapsibleState={vscode.TreeItemCollapsibleState.None}
        ></TreeItem>
        <TreeItem
          label="download as csv"
          iconPath={icon("desktop-download")}
          collapsibleState={vscode.TreeItemCollapsibleState.None}
        ></TreeItem>
        {/* <TreeItem label="submissions..."></TreeItem> */}
      </TreeItem>
    )
  }
}
