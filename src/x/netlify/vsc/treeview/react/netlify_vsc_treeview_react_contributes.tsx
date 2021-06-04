import { netlify_vsc_treeview_react_id } from "./netlify_vsc_treeview_react_id"
import merge from "webpack-merge"
import { menus_contributes } from "./menus"

export function netlify_vsc_treeview_react_contributes() {
  const cc = {
    contributes: {
      views: {
        netlify: [
          {
            id: netlify_vsc_treeview_react_id,
            name: "Netlify",
            // when: netlify_vsc_treeview_context_netlifyEnable,
          },
        ],
      },
    },
  }
  return merge(cc, menus_contributes())
}
