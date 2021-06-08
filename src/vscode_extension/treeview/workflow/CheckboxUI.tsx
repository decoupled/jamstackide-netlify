import React from "react"
import { computed, icon, None, observable, observer, TreeItem } from "../deps"

@observer
export class CheckboxUI extends React.Component<{ label: string }> {
  @observable checked = false
  @computed get icon() {
    return this.checked ? icon("check") : icon("chrome-maximize")
  }
  render() {
    return (
      <TreeItem
        key="checkbox"
        label={this.props.label}
        iconPath={this.icon}
        collapsibleState={None}
        select={() => {
          this.checked = !this.checked
        }}
      />
    )
  }
}
