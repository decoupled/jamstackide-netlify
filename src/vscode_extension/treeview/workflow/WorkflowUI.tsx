import React from "react"
import vscode from "vscode"
import { ProjectModel } from "../../dev/model/ProjectModel"
import {
  Collapsed,
  Expanded,
  icon,
  None,
  observable,
  observer,
  TreeItem,
  makeObservable,
} from "../deps"
import { menu_def_workflow } from "./menus"
import { StepDevelopUI } from "./StepDevelopUI"
import { buildLabelProps } from "./util/buildLabelProps"

@observer
export class WorkflowUI extends React.Component<{
  projectModel: ProjectModel
  ctx: vscode.ExtensionContext
}> {
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  @observable step = 0

  componentDidMount() {
    setInterval(() => {
      //console.log("this.step = ", this.step)
      if (this.step < 2) this.step++
    }, 5000)
  }
  private stateForStep(num: number) {
    return undefined
    if (num === this.step) return "running"
    if (num > this.step) return "disabled"
    return undefined
  }
  private render_1_fetch() {
    const label = "1.fetch code"
    const state = this.stateForStep(1)
    const description = undefined
    const iconPath = icon("cloud-download")
    const props = buildLabelProps({ label, state, description, iconPath })
    return <TreeItem {...props} collapsibleState={None} />
  }

  private render_2_develop_locally() {
    return (
      <StepDevelopUI
        projectModel={this.props.projectModel}
        ctx={this.props.ctx}
      />
    )
  }

  private render_3_build_locally() {
    const iconPath = icon("vm")
    const label = "3. build locally"
    const state = undefined
    const description = ""
    const props = buildLabelProps({ label, state, description })
    const collapsibleState = state === "disabled" ? None : Collapsed
    const bs = this.props.projectModel.buildServerModel

    const props2 = {
      iconPath: icon("gear"),
      state: bs.isRunning ? "running" : undefined,
      label: "rw build",
      description: "",
    } as const
    const props22 = buildLabelProps(props2)

    return (
      <TreeItem
        {...props}
        iconPath={iconPath}
        collapsibleState={collapsibleState}
      >
        <TreeItem
          select={() => bs.start()}
          {...props22}
          collapsibleState={None}
        />
        <TreeItem
          iconPath={icon("server-process")}
          select={() => bs.serve()}
          label="rw serve"
          collapsibleState={None}
        />
        <TreeItem
          iconPath={icon("browser")}
          label="browser"
          collapsibleState={None}
        />
      </TreeItem>
    )
  }

  private render_4_deploy() {
    const iconPath = icon("cloud-upload")
    const label = "4. push, preview and deploy"
    const state = undefined
    const description = "on netlify"
    const props = buildLabelProps({ label, state, description })
    const collapsibleState = state === "disabled" ? None : Collapsed
    return (
      <TreeItem
        {...props}
        iconPath={iconPath}
        collapsibleState={collapsibleState}
      ></TreeItem>
    )
  }

  private menu_workflow = menu_def_workflow.create({
    open_diagram: () => {
      console.log("open diagram!!")
    },
  })

  render() {
    return (
      <TreeItem
        label={"workflow"}
        iconPath={icon("checklist")}
        collapsibleState={Expanded}
        menu={this.menu_workflow}
      >
        {this.render_1_fetch()}
        {this.render_2_develop_locally()}
        {this.render_3_build_locally()}
        {this.render_4_deploy()}
      </TreeItem>
    )
  }
}
