import React from "react"
import {
  icon,
  makeObservable,
  None,
  observable,
  observer,
  TreeItem,
} from "../deps"

@observer
export class DebuggingUI extends React.Component {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
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
