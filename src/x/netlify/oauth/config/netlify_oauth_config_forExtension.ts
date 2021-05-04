import vscode from "vscode"
import { vscode_extensions_getCurrentExtensionID } from "../../../vscode/vscode_extensions_getCurrentExtensionID"
import { netlify_oauth_config_jamstackide } from "./netlify_oauth_config_jamstackide"
import { netlify_oauth_config_netlifyvscode } from "./netlify_oauth_config_netlifyvscode"
import { NetlifyOAuthConfig } from "./types"
export function netlify_oauth_config_forExtension(
  ctx: vscode.ExtensionContext
): NetlifyOAuthConfig {
  const id = vscode_extensions_getCurrentExtensionID(ctx)
  const cfgs = {
    "decoupled.jamstackide": netlify_oauth_config_jamstackide,
    "decoupled.netlify-ide": netlify_oauth_config_netlifyvscode,
  }
  const cc = cfgs[id]
  if (cc) return cc
  throw new Error(
    "could not find oauth client config for extension with id = " + id
  )
}
