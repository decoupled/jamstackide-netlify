import vscode from "vscode"
import { netlify_vsc_oauth_manager } from "../vsc/netlify_vsc_oauth_manager"
import { NetlifyAPIWrapper } from "./netlify_api"

export class NetlifyAPIServiceW {
  constructor() {
    private ctx: vscode.ExtensionContext
  }
  getAuthenticatedAPI(): NetlifyAPIWrapper | undefined {
    const { token } = netlify_vsc_oauth_manager(this.ctx)
    if (!token) return undefined
  }
}
