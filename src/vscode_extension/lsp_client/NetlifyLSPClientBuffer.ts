import { Singleton } from "lambdragon"
import vscode from "vscode"
import { LanguageClient } from "vscode-languageclient/node"
export class NetlifyLSPClientBuffer
  implements Singleton, Pick<LanguageClient, "sendRequest" | "onRequest"> {
  onClientChanged = new vscode.EventEmitter<LanguageClient | undefined>()

  private client: LanguageClient | undefined
  updateClient(client: LanguageClient | undefined) {
    this.onClientChanged.fire(client)
    this.client = client
    this.tick()
  }
  private sendRequest_queue: any[] = []
  sendRequest(...args: any[]) {
    return new Promise((resolve, reject) => {
      this.sendRequest_queue.push({ args, resolve, reject })
      this.tick()
    })
  }

  onRequest(...args: any[]) {
    const item: OnRequestHandler = { args }
    this.onRequest_list.push(item)
    this.tick()
    return {
      dispose() {
        item.disposable?.dispose?.()
        this.onRequest_list = this.onRequest_list.filter((x) => x !== item)
      },
    }
  }
  private tick() {
    const c = this.client
    if (!c) return
    // sendRequest
    this.sendRequest_queue.forEach(async ({ args, resolve, reject }) => {
      try {
        await c.onReady()
        resolve(await c.sendRequest(...(args as [any])))
      } catch (e) {
        reject(e)
      }
    })
    this.sendRequest_queue = []
    // onRequest
    for (const or of this.onRequest_list) {
      if (or.client !== c) {
        or.disposable?.dispose?.()
        or.client = c
        or.disposable = c.onRequest(...(or.args as [any, any]))
      }
    }
  }

  private onRequest_list: OnRequestHandler[] = []
}

interface OnRequestHandler {
  args: any[]
  disposable?: vscode.Disposable
  client?: LanguageClient
}
