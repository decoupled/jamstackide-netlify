import { DIFactory } from "lambdragon"
import * as vscode from "vscode"
import { ServerOptions } from "vscode-languageclient/node"
import { language_server_build_target } from "../../language_server/language_server"
import { NetlifyLSPClient } from "./NetlifyLSPClient"
export class NetlifyLSPClientManager {
  constructor(
    private ctx: vscode.ExtensionContext,
    private factory: DIFactory<typeof NetlifyLSPClient, [ServerOptions]>
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
    return this.factory(language_server_build_target.getServerOptions(this.ctx))
  }
}
