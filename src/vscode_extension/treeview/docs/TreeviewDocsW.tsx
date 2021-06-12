import { Singleton, TreeItem, TreeItem_render } from "lambdragon"
import React from "react"
import { memo } from "src/x/decorators"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode from "vscode"

const treeview_docs_id = "netlify.treeview.docs"
export class TreeviewDocsW implements Singleton {
  constructor() {
    this.render()
  }
  @memo() render() {
    const ll = links.map(([label, icn, url]) => (
      <TreeItem
        label={label}
        iconPath={icon(icn)}
        collapsibleState={vscode.TreeItemCollapsibleState.None}
        select={() => {
          if (typeof url === "string") {
            vscode.env.openExternal(vscode.Uri.parse(url))
          } else if (typeof url === "function") {
            ;(url as any)()
          }
        }}
      />
    ))
    return TreeItem_render(treeview_docs_id, <>{ll}</>)
  }
}

const links = [
  ["Netlify app", "question", "https://app.netlify.com/"],
  ["Documentation", "question", "https://docs.netlify.com/"],
  ["Community Forums", "comment-discussion", "https://answers.netlify.com/"],
  [
    "Report Issue (Github)",
    "issues",
    "https://github.com/netlify/project-vscode-extension/issues",
  ],
  ["Ping!", "search", () => vscode.window.showInformationMessage("ping!")],
  [
    "Debug Functions",
    "debug",
    () => vscode.window.showInformationMessage("debug functions"),
  ],
] as const

export function treeview_docs_contributes() {
  const c1 = treeview_docs_contributes_()
  return c1
  // return merge(c1, DevServerUI_contributes(), menus_contributes())
}

function treeview_docs_contributes_() {
  return {
    contributes: {
      views: {
        netlify: [
          {
            id: treeview_docs_id,
            name: "Shortcuts",
            // when: redwoodjs_vsc_enabled,
          },
        ],
      },
    },
  }
}
