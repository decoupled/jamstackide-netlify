import React from "react"
import {
  Expanded,
  None,
  observable,
  observer,
  TreeItem,
  makeObservable,
} from "../deps"
import { checkboxIcon } from "./util/checkboxIcon"

@observer
export class SyncBrowserWithEditorUI extends React.Component {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable checked = false
  @observable browser_to_editor = true
  @observable editor_to_browser = false
  render() {
    return (
      <TreeItem
        label="sync browser with editor"
        iconPath={checkboxIcon(this.checked)}
        select={() => {
          this.checked = !this.checked
        }}
        collapsibleState={this.checked ? Expanded : None}
      >
        <TreeItem
          label="browser --> editor"
          description="navigating on the browser changes the editor"
          iconPath={checkboxIcon(this.browser_to_editor)}
          collapsibleState={None}
          select={() => {
            this.browser_to_editor = !this.browser_to_editor
          }}
        />
        <TreeItem
          label="editor --> browser"
          description="navigating on the editor changes the browser"
          iconPath={checkboxIcon(this.editor_to_browser)}
          collapsibleState={None}
          select={() => {
            this.editor_to_browser = !this.editor_to_browser
          }}
        />
      </TreeItem>
    )
  }
}
