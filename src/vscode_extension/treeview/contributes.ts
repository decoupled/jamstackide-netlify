import merge from "webpack-merge"
import { netlify_vsc_treeview_react_contributes } from "x/netlify/vsc/treeview/react/contributes"
import { treeview_docs_contributes } from "./docs/TreeviewDocsW"
import { treeview_outline_contributes } from "./outline/consts"
import { treeview_workflow_contributes } from "./workflow/contributes"

export function treeview_contributes() {
  return merge([
    treeview_docs_contributes().contributes,
    netlify_vsc_treeview_react_contributes().contributes,
    treeview_outline_contributes().contributes,
    // treeview_etc_contributes().contributes,
    treeview_workflow_contributes().contributes,
    {
      viewsContainers: {
        activitybar: [
          {
            id: "netlify",
            title: "Netlify",
            icon: "netlify_logomark.svg",
          },
        ],
      },
    },
  ])
}
