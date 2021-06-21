import React from "react"
import {
  NetlifyCLINotAuthError,
  NetlifyCLINotLinkedError,
  NetlifyCLIStatusResult,
  NetlifyCLIWrapper,
} from "src/vscode_extension/NetlifyCLIWrapper"
import vscode from "vscode"
import { icon, None, observer, TreeItem } from "./deps"
import { menu_def2__logged_in, menu_def2__site2 } from "./menus"

@observer
export class StatusUI extends React.Component<{
  ctx: vscode.ExtensionContext
  cli: NetlifyCLIWrapper
  wf: vscode.WorkspaceFolder
}> {
  // componentDidMount() {
  //   // this.fetchAndUpdateStatus()
  // }
  // async fetchAndUpdateStatus() {
  //   try {
  //     this.status = await this.props.cli.status(this.props.wf.uri.fsPath)
  //   } catch (e) {
  //     this.status = e
  //   } finally {
  //     setTimeout(() => this.fetchAndUpdateStatus(), 5000)
  //   }
  // }
  // @observable status:
  //   | NetlifyCLIStatusResult
  //   | NetlifyCLINotAuthError
  //   | NetlifyCLINotLinkedError
  //   | undefined

  get status2() {
    return this.props.cli.forDir(this.props.wf.uri.fsPath).status.get()
  }

  get cwd() {
    return this.props.wf.uri.fsPath
  }

  private __menu = menu_def2__logged_in.create({
    logout: () => {
      this.props.cli.logout(this.cwd)
    },
    logout2: () => {
      this.props.cli.logout(this.cwd)
    },
  })

  render_status(s: NetlifyCLIStatusResult) {
    const { cli, wf } = this.props
    return (
      <>
        <TreeItem
          iconPath={icon("account")}
          menu={this.__menu}
          description=""
          label={s.data.account.Name}
          collapsibleState={None}
        />
        <SiteUI cli={cli} siteData={s.data.siteData} wf={wf} />
      </>
    )
  }
  private __login = () => {
    const cwd = this.props.wf.uri.fsPath
    this.props.cli.login_inTerminal(cwd)
    // this.props.cli.login(cwd)
  }

  private __link = () => {
    const cwd = this.props.wf.uri.fsPath
    this.props.cli.link_inTerminal(cwd)
  }

  empty() {
    return <TreeItem label="..." collapsibleState={None} />
  }

  render() {
    // const s = this.status
    const s = this.status2
    console.log("this.status2 ", this.status2)
    if (s instanceof NetlifyCLINotAuthError) {
      return (
        <>
          <TreeItem
            iconPath={icon("account")}
            label="Login to Netlify"
            select={this.__login}
            description=""
            collapsibleState={None}
          />
          {this.empty()}
        </>
      )
    } else if (s instanceof NetlifyCLINotLinkedError) {
      return (
        <>
          <TreeItem
            iconPath={icon("link")}
            label="Link a Netlify site to this project"
            collapsibleState={None}
            description=""
            select={this.__link}
          />
          {this.empty()}
        </>
      )
    } else if (s instanceof NetlifyCLIStatusResult) {
      return this.render_status(s)
    } else {
      return (
        <>
          <TreeItem
            label=""
            description={""}
            iconPath={undefined}
            collapsibleState={None}
          />
          {this.empty()}
        </>
      )
    }
  }
}

type SiteData = NetlifyCLIStatusResult["data"]["siteData"]

class SiteUI extends React.Component<{
  siteData: SiteData
  cli: NetlifyCLIWrapper
  wf: vscode.WorkspaceFolder
}> {
  get menu() {
    const { wf, cli, siteData } = this.props
    const { "site-url": url, "admin-url": adminURL } = siteData
    const admin = () => opn(adminURL)
    const preview = () => opn(url)
    const unlink = async () => {
      const res = await vscode.window.showWarningMessage(
        "Are you sure you want to 'unlink' the Netlify site from this project?",
        "YES",
        "NO"
      )
      if (res !== "YES") return
      cli.unlink_inTerminal(wf.uri.fsPath)
    }
    return menu_def2__site2.create({
      admin,
      admin2: admin,
      preview,
      preview2: preview,
      unlink,
      unlink2: unlink,
    })
  }
  render() {
    try {
      const { "site-name": name, "site-url": url } = this.props.siteData
      return (
        <TreeItem
          iconPath={icon("globe")}
          menu={this.menu}
          label="site"
          description={name}
          collapsibleState={None}
          select={() => opn(url)}
        />
      )
    } catch (e) {
      console.log(e)
    }
  }
}

function opn(url: string) {
  vscode.env.openExternal(vscode.Uri.parse(url))
}
