import * as xlib from "@decoupled/xlib"
import { keep, VSCodeCommand, VSCodeMeta } from "lambdragon"
import vscode from "vscode"
import { netlify_ids } from "../util/netlify_ids"
import { when_clauses } from "../util/when_clauses"

export class RightClickCommands {
  constructor(private wf: vscode.WorkspaceFolder) {
    keep(menusMeta)
    add_redirect_cmd.register(async (maybeUri) => {
      if (maybeUri) {
        const uri = xlib.vscode_Uri_smartParse(maybeUri)
        if (uri.fsPath.endsWith("netlify.toml")) {
          const editor = await vscode.window.showTextDocument(uri)
          const res = xlib.toml_path_to_insert_info(editor.document.getText(), {
            path: ["redirects"],
            hint: "arr-push",
          })
          if (!res) return
          const { after, before, position } = res
          const snip = new vscode.SnippetString(
            "\n" + before + redirect_snippet + after + "\n"
          )
          editor.insertSnippet(snip, xlib.Position_iso.reverseGet(position))
        }
      }
    })
  }
}

const redirect_snippet = `
from = "\${1:/old-path}"
to = "\${2:/new-path}"
status = \${3:301}
# force = false
# query = {path = ":path"}
# conditions = {Language = ["en"], Country = ["US"], Role = ["admin"]}
`.trim()

const menusMeta = new VSCodeMeta(() => {
  function cc(group: string) {
    return [
      ...netlify_toml_commands().map((cmd) => {
        return {
          when: when_clauses.is_netlify_toml,
          command: cmd.command,
          group,
        }
      }),
      ...headers_commands().map((cmd) => {
        return {
          when: when_clauses.is_headers,
          command: cmd.command,
          group,
        }
      }),
      ...redirects_commands().map((cmd) => {
        return {
          when: when_clauses.is_redirects,
          command: cmd.command,
          group,
        }
      }),
    ]
  }
  return {
    menus: {
      "explorer/context": [...cc("2_netlify")],
      "editor/context": [...cc("2_netlify")],
    },
  }
})

// https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups

function netlify_toml_commands() {
  // all commands apply to netlify.toml
  return [
    add_redirect_cmd,
    add_context_cmd,
    add_custom_header_cmd,
    add_edge_handler_cmd,
  ]
}

function headers_commands() {
  return [add_custom_header_cmd]
}

function redirects_commands() {
  return [add_redirect_cmd]
}

export const add_redirect_cmd = new VSCodeCommand<[uri?: string | vscode.Uri]>({
  command: netlify_ids.netlify.commands.add_redirect.$id,
  title: "Add Redirect",
  category: "Netlify",
})

export const add_context_cmd = new VSCodeCommand<[uri?: string | vscode.Uri]>({
  command: netlify_ids.netlify.commands.add_context.$id,
  title: "Add Context",
  category: "Netlify",
})

export const add_custom_header_cmd = new VSCodeCommand<
  [uri?: string | vscode.Uri]
>({
  command: netlify_ids.netlify.commands.add_custom_header.$id,
  title: "Add Custom Header",
  category: "Netlify",
})

export const add_edge_handler_cmd = new VSCodeCommand<
  [uri?: string | vscode.Uri]
>({
  command: netlify_ids.netlify.commands.add_edge_handler.$id,
  title: "Add Edge Handler",
  category: "Netlify",
})
