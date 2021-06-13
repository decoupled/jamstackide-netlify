import React from "react"
import { wait } from "x/Promise/wait"
import vscode from "vscode"
import merge from "webpack-merge"
import {
  icon,
  menu,
  menudef,
  menudef_json,
  None,
  observable,
  observer,
  TreeItem,
} from "../deps"
import { buildLabelProps } from "./util/buildLabelProps"

// https://github.com/microsoft/vscode/issues/45119

export type DevServerStatus = "stopped" | "starting" | "started"

export interface DevServerUIModel {
  status: DevServerStatus
  componentDidMount?(): void
  view_logs?(): void
  start(): void
  restart(): void
  stop(): void
  description?: string
}

@observer
export class DevServerUI extends React.Component<{
  model: DevServerUIModel
}> {
  componentDidMount() {
    this.props.model.componentDidMount?.()
  }

  private view_logs = () => this.props.model.view_logs?.()

  private menu_stopped = menu(menu_def_stopped, {
    start: () => this.props.model.start(),
    view_logs: this.view_logs,
  })

  private menu_starting = menu(menu_def_starting, {
    stop: () => this.props.model.stop(),
    view_logs: this.view_logs,
  })

  private menu_running = menu(menu_def_running, {
    stop: () => this.props.model.stop(),
    restart: () => this.props.model.restart(),
    view_logs: this.view_logs,
  })

  private start = () => this.props.model.start()

  render() {
    const { description, status } = this.props.model
    if (status === "stopped") {
      return (
        <TreeItem
          {...buildLabelProps({
            label: "dev server",
            state: "disabled",
            iconPath: icon("play-circle"),
          })}
          select={this.start}
          collapsibleState={None}
          menu={this.menu_stopped}
        />
      )
    }
    if (status === "starting") {
      return (
        <TreeItem
          {...buildLabelProps({
            label: "dev server",
            description: `[starting] ${description}`,
            state: "running",
            iconPath: icon("play-circle"),
          })}
          collapsibleState={None}
          menu={this.menu_starting}
        />
      )
    }
    return (
      <TreeItem
        label="dev server"
        description={`[running] ${description}`}
        iconPath={icon("play-circle")}
        collapsibleState={None}
        menu={this.menu_running}
      />
    )
  }
}

const base = "jamstack.devserver"

const stop = {
  title: "Stop Dev Server",
  icon: "$(stop-circle)",
  group: "inline",
} as const

const view_logs = {
  title: "View Logs (output)",
  icon: "$(output)",
  group: "inline",
} as const

const menu_def_stopped = menudef({
  id: base + ".item-stopped",
  commands: {
    start: {
      title: "Start Dev Server",
      icon: "$(play-circle)",
      group: "inline",
    },
    view_logs,
  },
})

const menu_def_starting = menudef({
  id: base + ".item-starting",
  commands: {
    stop,
    view_logs,
  },
})

const menu_def_running = menudef({
  id: base + ".item-running",
  commands: {
    stop,
    restart: {
      title: "Restart Dev Server",
      icon: "$(debug-restart)",
      group: "inline",
    },
    view_logs,
  },
})

export function DevServerUI_contributes() {
  return merge(
    menudef_json(menu_def_stopped),
    menudef_json(menu_def_starting),
    menudef_json(menu_def_running)
  ).contributes
}

export class DevServerUIModel_mock implements DevServerUIModel {
  @observable status: DevServerStatus = "stopped"

  description = "redwood.js + netlify dev"

  componentDidMount() {
    this.start()
  }

  async start() {
    await wait(2000)
    this.status = "starting"
    await wait(5000)
    if (this.status === "starting") this.status = "started"
  }

  stop() {
    this.status = "stopped"
  }

  restart() {
    this.stop()
    this.start()
  }

  view_logs = () => {
    vscode.window.showInformationMessage("TODO: show logs")
  }
}

{
  menudef({
    id: base + ".item-running",
    commands: {
      stop,
      restart: {
        title: "Restart Dev Server",
        icon: "$(debug-restart)",
        group: "inline",
      },
      view_logs,
    },
  })
}
