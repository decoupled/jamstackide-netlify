import { lazy } from "@decoupled/xlib"
import React from "react"
import vscode from "vscode"
import * as api from "../../../api/netlify_api"
import { menu, observer, TreeItem } from "./deps"
import { menu_def_snippet } from "./menus"

@observer
export class SiteSnippet extends React.Component<{
  data: api.NetlifySiteSnippet
}> {
  @lazy() get contentUri() {
    const x = this.props.data
    const uri = `netlify-api:/snippets/${x.site.id}/${x.id}/snippet-content.html`
    return vscode.Uri.parse(uri)
  }
  private onSelect = () => {
    vscode.window.showTextDocument(this.contentUri)
  }
  private snippet__menu = menu(menu_def_snippet, {
    rename: () => {
      vscode.window.showInformationMessage("TODO: implement snippet.rename()")
    },
    change_position: () => {
      const currentValue = this.props.data.general_position
      const header = {
        label: "Header",
        description: "Insert snippet before </head>",
        picked: currentValue === "header",
        _value: "header",
      }
      const footer = {
        label: "Footer",
        description: "Insert snippet before </body>",
        picked: currentValue === "footer",
        _value: "footer",
      }
      const qp = vscode.window.createQuickPick<typeof header>()
      qp.title = "Choose Snippet Position"
      qp.items = [header, footer]
      qp.show()
      qp.onDidAccept(async () => {
        const item = qp.selectedItems[0]
        if (item) {
          if (item._value !== currentValue) {
            try {
              qp.busy = true
              qp.title = "Updating Snippet Position"
              await this.props.data.update({ general_position: item._value })
              qp.busy = false
            } catch (e) {
              vscode.window.showErrorMessage(e + "")
            }
          }
        }
        qp.dispose()
      })
    },
  })
  render() {
    const f = this.props.data
    return (
      <TreeItem
        label={f.treeview_label}
        description={f.treeview_description}
        tooltip={f.treeview_tooltip}
        // iconPath={icon("code")}
        select={this.onSelect}
        collapsibleState={vscode.TreeItemCollapsibleState.None}
        menu={this.snippet__menu}
        resourceUri={this.contentUri}
      />
    )
  }
}
