import merge from "webpack-merge"
import { menudef, menudef_json } from "../deps"

const base = "netlify.treeview.workflow.menus"

export const menu_def_workflow = menudef({
  id: base + ".menu_def_workflow",
  commands: {
    open_diagram: {
      title: "Open Diagram",
      icon: "$(circuit-board)",
      group: "inline",
    },
  },
})

export function menus_contributes() {
  const defs = [
    //menu_def_logged_out,
    menu_def_workflow,
  ]
  return merge(defs.map(menudef_json)).contributes
}
