import { DecorationData } from "x/netlify/etc/DecorationData"
import * as vscode from "vscode"
import { NetlifyLSPClientBuffer } from "./lsp_client/NetlifyLSPClientBuffer"

export class TextEditorDecorationsProviderFromLSPClient {
  constructor(private lspClient: NetlifyLSPClientBuffer) {}
  async getDecorationsForDoc(uri: vscode.Uri): Promise<DecorationData[]> {
    const res = await this.lspClient.sendRequest(
      "xxx/decorations",
      uri.toString()
    )
    return res as DecorationData[]
  }
}
