import vscode from "vscode"

type Nonce = string
type TokenCallback = (k: string) => void

export function netlify_vsc_oauth(ctx: vscode.ExtensionContext) {
  // const oauthTokenFlowsInProgress: Record<Nonce, TokenCallback> = {}
  // TODO: do something with URIs and yarn create
  // yarn create react-app my-app
  // vscode_window_registerUriHandler_multi({
  //   handleUri(uri) {
  //     console.log("received uri", uri)
  //   },
  // })
  // vscode_window_registerUriHandler_multi({
  //   handleUri(uri) {
  //     console.log("received uri 2", uri)
  //   },
  // })
  // vscode.commands.registerCommand(netlify_vsc_commands.oauth.command, () => {
  //   const flow = new NetlifyOAuthFlow()
  //   flow.start()
  // })
}
