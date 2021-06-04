import { memo } from "src/x/decorators"

import { NetlifyLanguageServer } from "./NetlifyLanguageServer"

/**
 * A set of custom methods (not included in the LSP spec) exposed to the client
 * via the sendRequest/onRequest mechanism.
 */
export class XMethodsManager {
  constructor(public server: NetlifyLanguageServer) {}
  @memo() start() {
    const { server } = this
    const { connection } = server
    connection.onRequest(xmethods.getInfo, async (uri: string) => {
      const node = await server.getProject()?.findNode(uri)
      if (!node) return undefined
      return await node.collectIDEInfo()
    })
  }
}

export const xmethods = {
  getInfo: "netlify/x-getInfo",
}
