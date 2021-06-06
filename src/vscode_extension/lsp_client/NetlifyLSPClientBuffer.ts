import { Singleton } from "lambdragon"
import { LanguageClient } from "vscode-languageclient/node"

export class NetlifyLSPClientBuffer
  implements Singleton, Pick<LanguageClient, "sendRequest" | "onRequest"> {
  private client: LanguageClient | undefined
  updateClient(client: LanguageClient | undefined) {
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
  private onRequest_queue: any[] = []
  onRequest(...args: any[]) {
    this.onRequest_queue.push(args)
    this.tick()
    return { dispose() {} } //<-TODO
  }
  private tick() {
    const c = this.client
    if (!c) return
    // sendRequest
    this.sendRequest_queue.forEach(async ({ args, resolve, reject }) => {
      try {
        await c.onReady()
        resolve(await c.sendRequest( ...(args as [any])))
      } catch (e) {
        reject(e)
      }
    })
    this.sendRequest_queue = []
    // onRequest
    this.onRequest_queue.forEach((args) => c.onRequest(...(args as [any, any])))
    this.onRequest_queue = []
  }
}
