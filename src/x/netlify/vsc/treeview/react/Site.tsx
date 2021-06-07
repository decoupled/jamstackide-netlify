import {
  TreeItem,
  TreeItem_Menu_create as TreeItemMenu_create,
} from "lambdragon"
import { observer } from "mobx-react"
import React from "react"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"
import { lazy } from "x/decorators"
import * as api from "../../../api/netlify_api"
import { LinkUI } from "./LinkUI"
import { menu_def_site } from "./menus"
import { SiteDeploys } from "./SiteDeploys"
import { SiteSnippets } from "./SiteSnippets"
import { SiteForms } from "./SiteForms"

@observer
export class Site extends React.Component<{
  site: api.NetlifySite
}> {
  private addDomain = () => {
    vscode.window.showInformationMessage("add domain??")
  }
  private develop_locally_cb = () => {
    const source = this.props.site.repo_url
    if (!source) return
    // develop_locally(
    //   {
    //     action: "FromNetlifyExplorer",
    //     source,
    //   },
    //   this.props.ctx
    // )
  }
  private develop_locally__render() {
    const { site } = this.props
    if (!site.repo_url) return null
    return (
      <TreeItem
        label="develop locally..."
        description="clone and develop site locally"
        tooltip="clone repo and use Netlify Dev"
        iconPath={icon("remote-explorer")}
        collapsibleState={vscode.TreeItemCollapsibleState.None}
        select={this.develop_locally_cb}
      />
    )
  }

  private snippets__render() {
    return <SiteSnippets site={this.props.site} />
  }

  private menu = TreeItemMenu_create(menu_def_site, {
    preview: () => {
      const {
        site: { url },
      } = this.props
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
    delete: async () => {
      const { site } = this.props
      const value = await vscode.window.showInputBox({
        prompt: `Warning: Deleting a site cannot be undone.
        To continue please re-enter the site name (${site.name})`,
      })
      if (!value) return
      if (value === site.name || value === "!!!") {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Deleting site ${site.name}`,
          },
          async () => {
            try {
              await site.deleteSite()
            } catch (e) {
              if (e) {
                vscode.window.showErrorMessage(String(e))
              }
            }
          }
        )
      } else {
        vscode.window.showInformationMessage(
          `you entered a different site name. please try again`
        )
      }
    },
    develop: async () => {
      const source = this.props.site.repo_url
      if (!source) return
      // develop_locally(
      //   {
      //     action: "FromNetlifyExplorer",
      //     source,
      //   },
      //   this.props.ctx
      // )
    },
  })

  @lazy() get envVarsUri() {
    return vscode.Uri.parse(`netlify-api:/env/${this.props.site.id}/.env`)
  }
  private onEnvVarClick = () => {
    vscode.window.showTextDocument(this.envVarsUri)
  }

  render() {
    const { site } = this.props
    const { custom_domain, admin_url, url } = site
    //        iconPath={icon("browser")}
    return (
      <TreeItem
        label={site.name}
        tooltip={site.treeItem_tooltip}
        description={custom_domain ?? ""}
        menu={this.menu}
      >
        {() => {
          return (
            <>
              <SiteDeploys site={site} />
              {url && <LinkUI label="open site" url={url} />}
              {url && (
                <LinkUI
                  label="open site in vscode browser"
                  url={url}
                  useVSCodeBrowser={true}
                />
              )}
              {admin_url && <LinkUI label="open admin" url={admin_url} />}
              {!custom_domain && (
                <TreeItem
                  label="add domain..."
                  iconPath={icon("globe")}
                  tooltip="register a new domain for this site"
                  select={this.addDomain}
                  collapsibleState={vscode.TreeItemCollapsibleState.None}
                />
              )}
              <SiteForms site={site} />
              <TreeItem
                label="analytics"
                iconPath={icon("graph")}
                collapsibleState={vscode.TreeItemCollapsibleState.None}
              />
              <TreeItem
                label="large media"
                iconPath={icon("file-media")}
                collapsibleState={vscode.TreeItemCollapsibleState.None}
              />
              <TreeItem
                label="identity"
                iconPath={icon("person")}
                collapsibleState={vscode.TreeItemCollapsibleState.None}
              />
              <TreeItem
                label="build.env"
                description="environment variables (build)"
                iconPath={icon("symbol-namespace")}
                collapsibleState={vscode.TreeItemCollapsibleState.None}
                //resourceUri={this.envVarsUri}
                select={this.onEnvVarClick}
              />
              {this.develop_locally__render()}
              {this.snippets__render()}
            </>
          )
        }}
      </TreeItem>
    )
  }
}
