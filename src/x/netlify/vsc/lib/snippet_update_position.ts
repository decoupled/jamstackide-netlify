import { netlify_oauth_get_token } from "../../oauth/netlify_oauth_get_token"
import { netlify_vsc_oauth_manager } from "../netlify_vsc_oauth_manager"
import vscode from "vscode"

export async function snippet_update_position(props: {
  ctx: vscode.ExtensionContext
  site_id: string
  snippet_id: string
  position: string
}) {
  const token = await netlify_vsc_oauth_manager(
    props.ctx
  ).get_token_login_if_needed()
}
