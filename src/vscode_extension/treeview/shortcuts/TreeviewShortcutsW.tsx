import { Singleton, TreeItem_render } from "lambdragon"
import React from "react"
import vscode from "vscode"
import { memo } from "@decoupled/xlib"
import { icon, None, TreeItem } from "../deps"

const treeview_shortcuts_id = "netlify.treeview.shortcuts"
export class TreeviewShortcutsW implements Singleton {
  constructor() {
    this.render()
  }
  @memo() private render() {
    const ll = links.map(([label, icn, url]) => (
      <TreeItem
        label={label}
        iconPath={icon(icn)}
        collapsibleState={None}
        select={() => {
          if (typeof url === "string") {
            vscode.env.openExternal(vscode.Uri.parse(url))
          } else if (typeof url === "function") {
            ;(url as any)()
          }
        }}
      />
    ))
    return TreeItem_render(treeview_shortcuts_id, <>{ll}</>)
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
  // ["Ping!", "search", () => vscode.window.showInformationMessage("ping!")],
  // [
  //   "Debug Functions",
  //   "debug",
  //   () => vscode.window.showInformationMessage("debug functions"),
  // ],
] as const

export function treeview_docs_contributes() {
  return {
    views: {
      netlify: [
        {
          id: treeview_shortcuts_id,
          name: "Shortcuts",
        },
      ],
    },
  } as const
}
