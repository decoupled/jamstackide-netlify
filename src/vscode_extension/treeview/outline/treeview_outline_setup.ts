import { cloneDeep } from "lodash"
import { vscode_ThemeIcon_memo } from "src/x/vscode/vscode_ThemeIcon_memo"
import vscode, { Disposable } from "vscode"
import { LanguageClient } from "vscode-languageclient/node"
import { log } from "../../log"
import { contextValue } from "./consts"
import { icon_uri } from "./icon_uri"
import { register_commands } from "./register_commands"
import { treeview_outline_id } from "./treeview_outline_id"
import { treeview_outline_method_prefix } from "./treeview_outline_method_prefix"

export function treeview_outline_setup(
  ctx: vscode.ExtensionContext,
  client: Pick<LanguageClient, "onRequest" | "sendRequest">
): vscode.Disposable {
  const disposables: Disposable[] = []
  const d = register_commands((id, commandShortName) => {
    // client.sendRequest("netlify/x-outline-callMethod", [id, method])
    const cmd = treeItemCache[id]?.menu?.[commandShortName]
    if (cmd) {
      const cmd2 = processCommand(cmd)
      vscode.commands.executeCommand(cmd2.command, ...(cmd2.arguments ?? []))
    }
  })
  disposables.push(d)
  const treeItemCache: any = {}
  const tv = vscode.window.createTreeView(treeview_outline_id, {
    treeDataProvider: {
      async getChildren(id: string | undefined): Promise<string[]> {
        try {
          const res = await client.sendRequest(
            treeview_outline_method_prefix + "getChildren",
            id
          )
          return res as any
        } catch (e) {
          log(treeview_outline_method_prefix + "getChildren error: " + e)
          return []
        }
      },
      async getTreeItem(id) {
        const item: any = await client.sendRequest(
          treeview_outline_method_prefix + "getTreeItem",
          id
        )
        // eslint-disable-next-line prefer-const
        let { iconPath, resourceUri, command, tooltip, ...rest } = item
        if (typeof iconPath === "string") {
          if (iconPath.includes("://")) {
            iconPath = vscode.Uri.file(iconPath)
          } else {
            if (iconPath.startsWith("x-")) {
              iconPath = icon_uri(iconPath.split("-")[1], ctx)
            } else {
              iconPath = vscode_ThemeIcon_memo(iconPath)
            }
          }
        }
        if (typeof resourceUri === "string") {
          if (resourceUri.includes("://")) {
            resourceUri = vscode.Uri.file(resourceUri)
          }
        }
        if (command) {
          command = processCommand(command)
        }
        if (typeof tooltip === "string") {
          const mdstr = new vscode.MarkdownString(tooltip, true)
          mdstr.isTrusted = true
          tooltip = mdstr
        }

        const item2 = { ...rest, iconPath, resourceUri, command, tooltip }
        if (item2.menu) {
          item2.contextValue = contextValue(item2.menu.kind)
        }
        treeItemCache[id] = item2
        return item2
      },
      onDidChangeTreeData(listener) {
        client.onRequest(
          treeview_outline_method_prefix + "onDidChangeTreeData",
          (id) => {
            listener(id)
          }
        )
        // and just in case, refresh everything every 5s
        // setInterval(listener, 5000) //
        return null as any
      },
    },
    showCollapseAll: true,
  })
  return vscode.Disposable.from(...disposables, tv)
}

function processCommand(cmd: vscode.Command): vscode.Command {
  const { command, arguments: args, ...rest } = cloneDeep(cmd)
  if (args) {
    const a0 = args[0]
    if (typeof a0 === "string") {
      if (
        a0.startsWith("https://") ||
        a0.startsWith("http://") ||
        a0.startsWith("file://")
      ) {
        args[0] = vscode.Uri.parse(a0)
      }
    }
  }
  return { command, arguments: args, ...rest }
}
