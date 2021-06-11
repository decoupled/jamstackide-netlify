import merge from "webpack-merge"
// import { menus_contributes } from "./menus"
import { netlify_vsc_treeview_config_id } from "./treeview_id"

export function netlify_vsc_treeview_config_contributes() {
  const cc = {
    contributes: {
      views: {
        explorer: [
          {
            id: netlify_vsc_treeview_config_id,
            name: "Netlify",
            // when: netlify_vsc_treeview_context_netlifyEnable,
          },
        ],
      },
    },
  }
  return merge(
    cc

    // menus_contributes()
  )
}
