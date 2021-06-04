import { Singleton } from "lambdragon"
import { LanguageClient } from "vscode-languageclient/node"

export class NetlifyLSPClientBuffer implements Singleton {
  private queue: any[] = []
  private client: LanguageClient | undefined
  updateClient(client: LanguageClient | undefined) {
    this.client = client
    this.tick()
  }
  sendRequest(...args: any[]) {
    return new Promise((resolve, reject) => {
      this.queue.push({ args, resolve, reject })
      this.tick()
    })
  }
  private tick() {
    const c = this.client
    if (!c) return
    this.queue.forEach(async ({ args, resolve, reject }) => {
      try {
        await c.onReady()
        resolve(await c.sendRequest.apply(c, args))
      } catch (e) {
        reject(e)
      }
    })
    this.queue = []
  }
}
