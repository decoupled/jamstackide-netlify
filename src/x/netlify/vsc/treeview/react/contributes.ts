import { when_clauses } from "src/vscode_extension/util/when_clauses"
import merge from "webpack-merge"
import { menus_contributes } from "./menus"
import { netlify_vsc_treeview_react_id } from "./treeview_id"

export function netlify_vsc_treeview_react_contributes() {
  const cc = {
    views: {
      netlify: [
        {
          id: netlify_vsc_treeview_react_id,
          name: "Accounts",
          when: when_clauses.config_netlify_experimental_enable,
        },
      ],
    },
  }
  return merge(cc, menus_contributes())
}
