import { memo } from "src/x/decorators"
import vscode from "vscode"
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
} from "vscode-languageclient/node"
import { NetlifyLSPClientBuffer } from "./NetlifyLSPClientBuffer"
export class NetlifyLSPClient {
  constructor(
    private serverOptions: ServerOptions,
    private clientOptions: LanguageClientOptions,
    private buffer: NetlifyLSPClientBuffer,
    private out: vscode.OutputChannel
  ) {
    this.start()
  }
  status: "init" | "running" | "stopped" = "init"
  client!: LanguageClient
  private log(...args: any[]) {
    const msg = args.map(String).join(" ")
    this.out.appendLine(msg)
    console.log(msg)
  }

  @memo()
  private async start() {
    this.log(`NetlifyLSPClient().start()`)
    // Create the language client and start the client.
    this.client = new LanguageClient(
      "netlify-language-server",
      "Netlify Language Server",
      this.serverOptions,
      this.clientOptions
    )

    this.client.onDidChangeState((e) => {
      const labels = {
        [State.Running]: "Running",
        [State.Starting]: "Starting",
        [State.Stopped]: "Stopped",
      }
      this.log(
        "Language Client state change:",
        labels[e.oldState],
        "-->",
        labels[e.newState]
      )
    })

    // This will also launch the server
    this.client.start()
    await this.client.onReady()
    this.buffer.updateClient(this.client)
    this.log(`NetlifyLSPClient().client.onReady()`)
    this.status = "running"
    // this.client.onRequest("xxx/showQuickPick", vscode.window.showQuickPick)
    // this.client.onRequest(
    //   "xxx/showInformationMessage",
    //   vscode.window.showInformationMessage
    // )
    // // TODO: handle validate input
    // this.client.onRequest("xxx/showInputBox", vscode.window.showInputBox)
    // this.client.onRequest(
    //   "xxx/createTerminal2",
    //   async (props: { name: string; cwd: string; cmd: string }) => {
    //     vscode_window_createTerminal_andRun(props)
    //   }
    // )
    // this.setupOutline2()
  }

  // private setupTreeview() {
  //   treeview_outline_setup(ctx, client)
  // }

  async getInfo(uri: string): Promise<any[]> {
    await this.client.onReady()
    return []
  }

  // @memo()
  // private setupOutline2() {
  //   const { client, ctx } = this
  //   treeview_outline_setup({ client, ctx })
  // }

  async stop() {
    this.log(`NetlifyLSPClient().stop()`)
    if (this.status !== "running") {
      return false
    }
    await this.client.stop()
    this.status = "stopped"
  }
}
