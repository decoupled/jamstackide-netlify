// import { HeadersFileW } from "src/x/netlify/headers_file/headers_file_vsc"
import { RedirectsFileW } from "src/x/netlify/redirects_file/RedirectsFileW"
import { ReactTreeviewW } from "src/x/netlify/vsc/treeview/react/ReactTreeviewW"
import { CreateFunctionCommand } from "../commands/CreateFunctionCommand"
import { NetlifyLSPClientManager } from "../lsp_client/NetlifyLSPClientManager"
import { MagicURLsW } from "../magic_urls/magic_urls"
import { TextEditorDecorations } from "../TextEditorDecorations"
import { TreeviewDocsW } from "../treeview/docs/TreeviewDocsW"
import { TreeviewOutlineW } from "../treeview/outline/TreeviewOutlineW"
import { TreeviewWorkflowW } from "../treeview/workflow/TreeviewWorkflowW"

export class VSCodeProjectW {
  constructor(
    // this is just a top-level constructor that
    // aggregates all modules
    // _h: HeadersFileW,
    _r: RedirectsFileW,
    _c: CreateFunctionCommand,
    _l: NetlifyLSPClientManager,
    _t: TreeviewDocsW,
    _x: TextEditorDecorations,
    _rt: ReactTreeviewW,
    _rr: TreeviewOutlineW,
    _dddd: MagicURLsW,
    _twf: TreeviewWorkflowW
  ) {}
}
