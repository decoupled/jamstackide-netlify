import { TreeItemMenu } from "../deps"

const base = "netlify.treeview.workflow.menus"

export const menu_def_workflow = new TreeItemMenu({
  id: base + ".menu_def_workflow",
  commands: {
    open_diagram: {
      title: "Open Diagram",
      icon: "$(circuit-board)",
      group: "inline",
    },
  },
})
