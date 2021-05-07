import express from "express"
import { memo } from "src/x/decorators"
import { AddressInfo_cast_getPort_orThrow } from "src/x/net/AddressInfo"
import { vscode_extensions_getExtensionID } from "src/x/vscode/vscode_extensions_getExtensionID"
import { vscode_Uri_smartParse } from "src/x/vscode/vscode_Uri_smartParse"
import vscode from "vscode"

export function miniserver_init(ctx: vscode.ExtensionContext) {
  if (MiniServer.instance) throw new Error("cannot init twice")
  MiniServer.instance = new MiniServer()
  MiniServer.instance.start()
}

export function miniserver_port(): string {
  return MiniServer.instance.port() + ""
}

class MiniServer {
  @memo() start() {
    this.server()
  }
  @memo() server() {
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

  async run(method: string, args: any[]) {
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
      const ss = this.progressss.length
      vscode.window.withProgress(
        { title: args[0], location: vscode.ProgressLocation.Notification },
        () =>
          new Promise<any>((resolve, reject) => {
            this.progressss.push(resolve)
          })
      )
      return ss
    }
    if (method === "withProgress_end") {
      this.progressss[args[0]]()
      this.progressss[args[0]] = null
    }
  }

  progressss: any[] = []

  @memo() port(): number {
    return AddressInfo_cast_getPort_orThrow(this.server().address())
  }
  static instance?: MiniServer
}
{
}
