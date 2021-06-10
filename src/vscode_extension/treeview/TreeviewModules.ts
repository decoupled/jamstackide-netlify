import { ConfigTreeviewW } from "x/netlify/vsc/treeview/react/config/ConfigTreeviewW"
import { ReactTreeviewW } from "x/netlify/vsc/treeview/react/ReactTreeviewW"
import { TreeviewDocsW } from "./docs/TreeviewDocsW"
import { TreeviewOutlineW } from "./outline/TreeviewOutlineW"
import { TreeviewWorkflowW } from "./workflow/TreeviewWorkflowW"

export class TreeviewModules {
  constructor(
    _docs: TreeviewDocsW,
    _react: ReactTreeviewW,
    _config: ConfigTreeviewW,
    _outline: TreeviewOutlineW,
    _workflow: TreeviewWorkflowW
  ) {}
}
