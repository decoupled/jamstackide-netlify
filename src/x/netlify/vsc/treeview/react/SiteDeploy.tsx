import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { Collapsed, icon, menu, None, observer, TreeItem } from "./deps"
import { LinkUI } from "./LinkUI"
import { menu_def_deploy, menu_def_deploy_published } from "./menus"

@observer
export class SiteDeploy extends React.Component<{
  data: api.NetlifySiteDeploy
}> {
  get iconPath() {
    const d = this.props.data
    //return icon(d.treeview_iconPath)
    if (d.state2 === "published") return icon("circle-filled")
    if (d.state2 === "loading") return icon("loading")
    return icon("circle-outline")
  }

  private restore = async () => {
    const d = this.props.data
    const mm = "Yes! Restore this Deploy"
    const res = await vscode.window.showInformationMessage(
      "Restore this deploy? This will become the published version of your site.",
      { modal: true },
      mm
    )
    if (res !== mm) return
    vscode.window.withProgress(
      {
        title: `Restoring site ${d.site.name} to a previous deploy`,
        location: vscode.ProgressLocation.Notification,
      },
      async () => {
        await this.props.data.restoreSiteDeploy()
        vscode.window.showInformationMessage("Site restored!")
      }
    )
  }

  private menu = menu(menu_def_deploy, {
    preview: () => {
      const r = this.props.data.raw
      const url = r.deploy_ssl_url ?? r.deploy_url
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
    restore: this.restore,
    restore2: this.restore,
  })

  private menu_published = menu(menu_def_deploy_published, {
    preview: () => {
      const url = this.props.data.ssl_url__or__url
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
  })

  render() {
    const d = this.props.data
    const msgs = d?.raw?.summary?.messages ?? []
    return (
      <TreeItem
        label={d.treeview_label}
        iconPath={this.iconPath}
        description={d.treeview_description}
        tooltip={d.treeview_tooltip}
        collapsibleState={Collapsed}
        menu={d.state2 === "published" ? this.menu_published : this.menu}
      >
        <LinkUI label="open preview" url={d.ssl_url__or__url} />
        <LinkUI
          label="open preview in vscode browser"
          url={d.ssl_url__or__url}
          useVSCodeBrowser={true}
        />
        <LinkUI label="open admin" url={d.admin_url!} />
        <TreeItem
          label={"state: " + d.state}
          iconPath={icon("circle-outline")}
          collapsibleState={None}
        />
        <TreeItem
          label="summary"
          iconPath={icon("checklist")}
          collapsibleState={Collapsed}
        >
          {msgs.map((m, i) => {
            return (
              <TreeItem
                key={i}
                label={m.title}
                tooltip={`${m.description}\n${m.details}`}
                collapsibleState={None}
              />
            )
          })}
        </TreeItem>
      </TreeItem>
    )
  }
}
