import { Singleton } from "lambdragon"
import express from "express"
import { lazy, memo } from "x/decorators"
import { AddressInfo_cast_getPort_orThrow } from "x/net/AddressInfo"
import { vscode_Uri_smartParse } from "x/vscode/vscode_Uri_smartParse"
import vscode from "vscode"

const NETLIFY_VSCODE_RPC = "NETLIFY_VSCODE_RPC"

/**
 * starts a local HTTP server that the CLI uses to call back "into" vscode
 */
export class NetlifyCLIRPCServer implements Singleton {
  constructor() {
    this.server()
  }

  @memo() private server() {
    const app = express()
    app.use(express.json())
    app.post("/rpc", async (req, res) => {
      const x = req.body?.x
      if (!Array.isArray(x)) {
        console.error("xx")
        return
      }
      const [m, ...args] = x
      res.json({ x: await this.run(m, args) })
    })
    return app.listen()
  }

  private async run(method: string, args: any[]) {
    if (method === "info") {
      ;(vscode.window.showInformationMessage as any)(...args)
    }
    if (method === "warn") {
      ;(vscode.window.showWarningMessage as any)(...args)
    }
    if (method === "error") {
      ;(vscode.window.showErrorMessage as any)(...args)
    }
    if (method === "focusOnFile") {
      const uri = vscode_Uri_smartParse(args[0])
      vscode.window.showTextDocument(uri)
    }
    if (method === "withProgress") {
      const ss = this._progress.length
      vscode.window.withProgress(
        { title: args[0], location: vscode.ProgressLocation.Notification },
        () =>
          new Promise<any>((resolve, reject) => {
            this._progress.push(resolve)
          })
      )
      return ss
    }
    if (method === "withProgress_end") {
      this._progress[args[0]]()
      this._progress[args[0]] = null
    }
    if (method === "command") {
      const [cmd, ...rest] = args
      return await vscode.commands.executeCommand(cmd, ...rest)
    }
  }

  private _progress: any[] = []

  @lazy() get port(): number {
    return AddressInfo_cast_getPort_orThrow(this.server().address())
  }
  @lazy() get envForChildProcesses(): Record<string, any> {
    return {
      [NETLIFY_VSCODE_RPC]: this.port,
    }
  }
}
