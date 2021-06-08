import React from "react"
import vscode from "vscode"
import { ProjectModel } from "../../dev/model/ProjectModel"
import { Collapsed, Expanded, icon, None, observer, TreeItem } from "../deps"
import { BrowserPickerUI } from "./BrowserPickerUI"
import { DebuggingUI } from "./DebuggingUI"
import { DevServerUI } from "./DevServerUI"
import { LivePreviewURLUI } from "./LivePreviewURLUI"
import { SyncBrowserWithEditorUI } from "./SyncBrowserWithEditorUI"
import { buildLabelProps } from "./util/buildLabelProps"

@observer
export class StepDevelopUI extends React.Component<{
  projectModel: ProjectModel
  ctx: vscode.ExtensionContext
}> {
  get pc() {
    return this.props.projectModel
  }

  render() {
    const { pc } = this
    const label = "2.develop locally"
    const state = undefined //this.step >= 2 ? undefined : "disabled"
    const description = ""
    const iconPath = icon("json")
    const props = buildLabelProps({ label, state, description, iconPath })
    return (
      <TreeItem
        {...props}
        select={() => pc.click_develop_locally()}
        collapsibleState={Collapsed}
      >
        <DevServerUI model={pc.devServerModel} />
        {pc.browserModel.enabled ? (
          <TreeItem
            label="browser"
            iconPath={icon("browser")}
            description=""
            collapsibleState={Expanded}
            select={() => this.pc.browserModel.click_browser_item()}
          >
            <BrowserPickerUI
              type={pc.browserModel.selected_browser_type}
              onClickExternal={() =>
                pc.browserModel.click_browser_external_item()
              }
              onClickInternal={() =>
                pc.browserModel.click_browser_internal_item()
              }
            />
            <SyncBrowserWithEditorUI />
          </TreeItem>
        ) : (
          <TreeItem
            label=""
            iconPath={icon("browser")}
            description="browser"
            collapsibleState={None}
          ></TreeItem>
        )}
        <LivePreviewURLUI />
        <DebuggingUI />
      </TreeItem>
    )
  }
}
