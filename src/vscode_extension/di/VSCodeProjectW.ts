// import { HeadersFileW } from "src/x/netlify/headers_file/headers_file_vsc"
import { RedirectsFileW } from "src/x/netlify/redirects_file/RedirectsFileW"
import { CreateFunctionCommand } from "../commands/CreateFunctionCommand"
import { NetlifyLSPClientManager } from "../lsp_client/NetlifyLSPClientManager"
import { MagicURLsW } from "../magic_urls/magic_urls"
import { TextEditorDecorations } from "../TextEditorDecorations"
import { TreeviewModules } from "../treeview/TreeviewModules"

export class VSCodeProjectW {
  constructor(
    // this is just a top-level constructor that
    // aggregates all modules
    // _h: HeadersFileW,
    _r: RedirectsFileW,
    _c: CreateFunctionCommand,
    _l: NetlifyLSPClientManager,
    _x: TextEditorDecorations,
    _dddd: MagicURLsW,
    _treeviews: TreeviewModules
  ) {}
}
