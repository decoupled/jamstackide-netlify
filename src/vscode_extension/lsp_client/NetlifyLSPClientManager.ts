import { language_server_build_target } from "../../language_server/language_server"
import { NetlifyLSPClient } from "./NetlifyLSPClient"
import * as vscode from "vscode"
import { NetlifyLSPClientBuffer } from "./NetlifyLSPClientBuffer"

export class NetlifyLSPClientManager {
  constructor(
    private ctx: vscode.ExtensionContext,
    private buffer: NetlifyLSPClientBuffer
  ) {
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
      language_server_build_target.getServerOptions(this.ctx),
      this.ctx,
      this.buffer
    )
  }
}
