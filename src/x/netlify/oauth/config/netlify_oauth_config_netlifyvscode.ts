import { NetlifyOAuthConfig } from "./types"
export const netlify_oauth_config_netlifyvscode: NetlifyOAuthConfig = {
  client_id: "niKLFgeQaYiSjkrN87QQsivfd6J6tmp6j9A-kO9K3dM",
  // netlify.com does not accept a vscode:// url
  //redirect_uri: "vscode://decoupled.netlify-ide/oauth",
  redirect_uri: "http://localhost:47832",
}
