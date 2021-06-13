import { lazy, memo } from "x/decorators"
import { ExecuteCommandOptions } from "vscode-languageserver"
import { NetlifyLanguageServer } from "./NetlifyLanguageServer"

export const netlify_lsp_commands = {
  "netlify.lsp1": "netlify.lsp1",
} as const

export type CommandID = keyof typeof netlify_lsp_commands

export class CommandsManager {
  constructor(public server: NetlifyLanguageServer) {}

  @lazy() get options(): ExecuteCommandOptions {
    return {
      commands: Object.keys(netlify_lsp_commands),
      workDoneProgress: true,
    }
  }

  @memo() start() {
    const { connection } = this.server
    connection.onExecuteCommand(async (params) => {
      if (params.command === netlify_lsp_commands["netlify.lsp1"]) {
        const [cmd, cwd] = params.arguments ?? []
        console.log("netlify foo bar")
      }
    })
  }
}
