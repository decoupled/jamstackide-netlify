import React from "react"
import { icon, None, observable, observer, TreeItem } from "../deps"

@observer
export class DebuggingUI extends React.Component {
  @observable external = true
  render() {
    return (
      <TreeItem
        key="debugging"
        label="start debugging"
        iconPath={icon("debug-alt")}
        collapsibleState={None}
      />
    )
  }
}
