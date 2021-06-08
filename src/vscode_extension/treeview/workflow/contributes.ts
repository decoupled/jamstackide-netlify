import merge from "webpack-merge"
import { DevServerUI_contributes } from "./DevServerUI"
import { menus_contributes } from "./menus"
import { treeview_workflow_id } from "./treeview_workflow_id"

export function treeview_workflow_contributes() {
  const c1 = treeview_workflow_contributes_()
  return merge(c1, DevServerUI_contributes(), menus_contributes())
}

{
  treeview_workflow_contributes()
}

function treeview_workflow_contributes_() {
  return {
    contributes: {
      views: {
        netlify: [
          {
            id: treeview_workflow_id,
            name: "Workflow",
          },
        ],
      },
    },
  }
}
