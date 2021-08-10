import { Singleton, VSCodeCommand } from "lambdragon"
import vscode from "vscode"
import { NetlifyCLIWrapper } from "../NetlifyCLIWrapper"
import { netlify_ids } from "../util/netlify_ids"

export const login_cmd = new VSCodeCommand({
  command: netlify_ids.netlify.commands.login2.$id,
  title: "Login",
  category: "Netlify",
})

export class Commands implements Singleton {
  constructor(
    private ctx: vscode.ExtensionContext,
    private cli: NetlifyCLIWrapper
  ) {
    const d = login_cmd.register(async () => {
      cli.login_inTerminal("/")
    })
    this.ctx.subscriptions.push(d)
  }
}
