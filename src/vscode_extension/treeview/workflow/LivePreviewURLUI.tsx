import React from "react"
import { Expanded, icon, None, observable, observer, TreeItem } from "../deps"

@observer
export class LivePreviewURLUI extends React.Component {
  @observable enabled = false
  render() {
    return (
      <TreeItem
        key="live preview"
        label="enable live preview url"
        description=""
        iconPath={this.enabled ? icon("check") : icon("chrome-maximize")}
        collapsibleState={this.enabled ? Expanded : None}
        select={() => {
          this.enabled = !this.enabled
        }}
      >
        {!this.enabled && (
          <TreeItem
            key="loading"
            description="loading..."
            collapsibleState={None}
          ></TreeItem>
        )}
        {this.enabled && (
          <TreeItem
            key="clippy"
            iconPath={icon("clippy")}
            label="copy url to clipboard"
            collapsibleState={None}
          ></TreeItem>
        )}
        {this.enabled && (
          <TreeItem
            key="browser"
            iconPath={icon("link-external")}
            label="open in browser"
            collapsibleState={None}
          ></TreeItem>
        )}
      </TreeItem>
    )
  }
}
