import { ConfigTreeviewW } from "x/netlify/vsc/treeview/react/config/ConfigTreeviewW"
import { ReactTreeviewW } from "x/netlify/vsc/treeview/react/ReactTreeviewW"
import { TreeviewShortcutsW } from "./shortcuts/TreeviewShortcutsW"
import { TreeviewWorkflowW } from "./workflow/TreeviewWorkflowW"

export class TreeviewModules {
  constructor(
    _docs: TreeviewShortcutsW,
    _react: ReactTreeviewW,
    _config: ConfigTreeviewW,
    _workflow: TreeviewWorkflowW
  ) {}
}
