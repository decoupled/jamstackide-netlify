import { TreeItem, TreeItem_render } from "lambdragon"
import { memoize } from "lodash"
import React from "react"
import vscode from "vscode"

const treeview_etc_id = "netlify.treeview.etc"

const treeview_etc_get = memoize((ctx: vscode.ExtensionContext) => {
  return TreeItem_render(
    treeview_etc_id,
    <>
      <Menuu />
    </>
  )
})

const Menuu = () => (
  <TreeItem label="xx">
    <TreeItem label="features">
      <TreeItem label="functions...">
        <TreeItem label="func1.ts"></TreeItem>
      </TreeItem>
    </TreeItem>
  </TreeItem>
)

export function treeview_etc_activate(ctx: vscode.ExtensionContext) {
  treeview_etc_get(ctx)
}

export function treeview_etc_contributes() {
  const c1 = treeview_etc_contributes_()
  return c1
  // return merge(c1, DevServerUI_contributes(), menus_contributes())
}

function treeview_etc_contributes_() {
  return {
    contributes: {
      views: {
        netlify: [
          {
            id: treeview_etc_id,
            name: "Etc",
          },
        ],
      },
    },
  }
}
