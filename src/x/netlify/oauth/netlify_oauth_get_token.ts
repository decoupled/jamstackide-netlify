import express from "express"
import { Memoize as memo } from "lodash-decorators"
import { observable, when } from "mobx"
import nanoid from "nanoid"
import open from "open"
import { netlify_oauth_build_authorize_url } from "../oauth/netlify_oauth_build_authorize_url"
import { NetlifyOAuthConfig } from "./config/types"

/**
 * starts oauth2 flow and tries to get a token from netlify.com
 */
export function netlify_oauth_get_token(
  config: NetlifyOAuthConfig
): Promise<string | undefined> {
  const flow = new NetlifyOAuthFlow(config)
  return flow.start()
}

type ResponseData = {
  access_token: string
  token_type?: "Bearer"
  state: string
}

const port = 47832
class NetlifyOAuthFlow {
  constructor(public config: NetlifyOAuthConfig) {}
  state = nanoid()
  @observable data: ResponseData | undefined

  private startServer() {
    const app = express()
    app.get("/", (req, res) => {
      res.send(
        html_script(
          'window.location.href = "/cb?" + window.location.hash.substr(1)'
        )
      )
    })
    app.get("/cb", (req, res) => {
      this.data = req.query
      res.send(
        "Authentication successful - you can close this browser window and return to VSCode"
      )
    })
    return app.listen(port)
  }

  @memo() async start(): Promise<string> {
    const server = this.startServer()
    const auth_url = netlify_oauth_build_authorize_url({
      ...this.config,
      state: this.state,
    })
    open(auth_url)
    await when(() => typeof this.data !== "undefined")
    server.close()
    if (this.data?.state !== this.state) throw new Error("csrf?")
    return this.data.access_token
  }
}

function html_script(script: string) {
  return `<!DOCTYPE html>
  <html>
     <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
     </head>
  <body>
      <script type="text/javascript">
       ${script}
      </script>
  </body></html>`
}
