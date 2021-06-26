import { vscode_Uri_smartParse } from "@decoupled/xlib"
import vscode from "vscode"
import { VSCodeCommand, VSCodeMeta } from "x/vscode/vscode_elms"
import { netlify_ids } from "../util/netlify_ids"
import { when_clauses } from "../util/when_clauses"

export class RightClickCommands {
  constructor(private wf: vscode.WorkspaceFolder) {
    menusMeta.keep()
    add_redirect_cmd.register(async (maybeUri) => {
      if (maybeUri) {
        const uri = vscode_Uri_smartParse(maybeUri)
        if (uri.fsPath.endsWith("netlify.toml")) {
          const editor = await vscode.window.showTextDocument(uri)
          const snip = new vscode.SnippetString(redirect_snippet)
          const line = lineForInsert(editor.document.getText()) + 1
          const pos = line ? new vscode.Position(line, 0) : undefined
          editor.insertSnippet(snip, pos)
        }
      }
    })
  }
}

function lineForInsert(str: string): number | undefined {
  const lines = str.split("\n")
  let state_saw_redirects = false
  let state_last_line_with_content = 0
  for (const [i, line] of lines.entries()) {
    if (line.trim() === "[[redirects]]") {
      state_saw_redirects = true
    } else if (line.trim().startsWith("[")) {
      if (state_saw_redirects) return state_last_line_with_content ?? i
    } else if (line.trim().length > 0) {
      state_last_line_with_content = i
    }
  }
  // we reached the end
  if (state_saw_redirects) {
    return lines.length
  }
  return undefined
}

const redirect_snippet =
  "\n" + // initial empty line on purpose
  `
[[redirects]]
from = "\${1:/old-path}"
to = "\${2:/new-path}"
status = \${3:301}
# force = false
# query = {path = ":path"}
# conditions = {Language = ["en"], Country = ["US"], Role = ["admin"]}
`.trim() +
  "\n"

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

function isNetlifyTOML(maybeUri?: string | vscode.Uri): boolean {
  try {
    return vscode_Uri_smartParse(maybeUri!).toString().endsWith("netlify.toml")
  } catch (e) {}
  return false
}
