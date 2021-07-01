import {
  memo,
  vscode_react_TreeItem_render as TreeItem_render,
} from "@decoupled/xlib"
import { Singleton } from "lambdragon"
import React from "react"
import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import vscode from "vscode"
import { VSCodeView } from "lambdragon"
import { icon, None, TreeItem } from "../deps"
import { netlify_viewContainer } from "../netlify_viewContainer"

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
    return TreeItem_render(view_def.id, <>{ll}</>)
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

const view_def = new VSCodeView({
  id: netlify_ids.netlify.views.shortcuts.$id,
  name: "Shortcuts",
  _container: netlify_viewContainer,
})
