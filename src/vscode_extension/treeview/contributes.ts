import merge from "webpack-merge"
import { netlify_vsc_treeview_config_contributes } from "x/netlify/vsc/treeview/react/config/contributes"
import { netlify_vsc_treeview_react_contributes } from "x/netlify/vsc/treeview/react/contributes"
import { treeview_docs_contributes } from "./shortcuts/TreeviewShortcutsW"
import { treeview_workflow_contributes } from "./workflow/contributes"

export function treeview_contributes() {
  return merge([
    treeview_docs_contributes().contributes,
    netlify_vsc_treeview_react_contributes().contributes,
    netlify_vsc_treeview_config_contributes().contributes,
    treeview_workflow_contributes().contributes,
    {
      viewsContainers: {
        activitybar: [
          {
            id: "netlify",
            title: "Netlify",
            // icon: "netlify_logomark.svg",
            icon: "assets/icons2/netlify.svg",
          },
        ],
      },
    },
  ])
}
