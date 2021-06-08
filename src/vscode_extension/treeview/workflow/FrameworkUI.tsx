import React from "react"
import vscode from "vscode"
import { None, observer, TreeItem } from "../deps"

@observer
export class FrameworkUI extends React.Component<{
  framework?: string
  ctx: vscode.ExtensionContext
}> {
  render() {
    const { framework } = this.props
    if (!framework) return null
    if (framework === "redwood") {
      return (
        <TreeItem
          label="open redwood project explorer"
          // iconPath={vsc_assets_icon_uri("redwood", this.props.ctx)}
          collapsibleState={None}
        />
      )
    }
    return null
  }
}
