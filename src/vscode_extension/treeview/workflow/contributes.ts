import { when_clauses } from "src/vscode_extension/util/when_clauses"
import { treeview_workflow_id } from "./treeview_workflow_id"

export function treeview_workflow_contributes() {
  return {
    views: {
      netlify: [
        {
          id: treeview_workflow_id,
          name: "Workflow",
          when: when_clauses.config_netlify_experimental_enable,
        },
      ],
    },
  }
}
