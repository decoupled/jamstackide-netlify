import { NetlifyOAuthManager } from "../vsc/NetlifyOAuthManager"
import { NetlifyAPIWrapper } from "./netlify_api"

export class NetlifyAPIService {
  constructor(private oauth: NetlifyOAuthManager) {}
  getAuthenticatedAPI(): NetlifyAPIWrapper | undefined {
    const token = this.oauth.token
    if (!token) return undefined
    return new NetlifyAPIWrapper(token)
  }
  getAuthenticatedAPIOrThrow(): NetlifyAPIWrapper {
    const a = this.getAuthenticatedAPI()
    if (!a) throw new Error("not authenticated to netlify")
    return a
  }
}
