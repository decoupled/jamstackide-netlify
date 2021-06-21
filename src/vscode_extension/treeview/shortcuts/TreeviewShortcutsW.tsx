import { memo } from "@decoupled/xlib"
import { Singleton, TreeItem_render } from "lambdragon"
import React from "react"
import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import vscode from "vscode"
import { icon, None, TreeItem } from "../deps"

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
    return TreeItem_render(netlify_ids.netlify.views.shortcuts.$id, <>{ll}</>)
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
          id: netlify_ids.netlify.views.shortcuts.$id,
          name: "Shortcuts",
        },
      ],
    },
  } as const
}
