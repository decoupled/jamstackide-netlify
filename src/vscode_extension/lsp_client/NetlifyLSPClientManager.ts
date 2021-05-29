import vscode from "vscode"
import { language_server_build_target } from "../../language_server/language_server"
import { NetlifyLSPClient } from "./NetlifyLSPClient"

export class NetlifyLSPClientManager {
  constructor(private ctx: vscode.ExtensionContext) {
    language_server_build_target.onDevTimeChange(ctx, () => {
      this.restart()
    })
    this.restart()
  }
  private _current: NetlifyLSPClient | undefined
  private restart() {
    if (this._current) this._current.stop()
    this._current = this.create()
  }
  private create() {
    return new NetlifyLSPClient(
      language_server_build_target.getPathInVSCodeExtensionFolder(this.ctx),
      this.ctx
    )
  }
}
