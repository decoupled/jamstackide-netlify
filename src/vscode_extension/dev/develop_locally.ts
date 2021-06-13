import { Singleton } from "lambdragon"
import vscode, { Uri } from "vscode"
import { Command } from "vscode-languageserver-types"
import { memo } from "x/decorators"
import { wait } from "x/Promise/wait"
import {
  NewJamstackProjectSource,
  NewJamstackProjectSourceString,
  NewJamstackProjectSource_autoPickDir,
  NewJamstackProjectSource_parse,
} from "../util/NewJamstackProjectSource"
import { NewJamstackProjectSource_prompt } from "../util/NewJamstackProjectSource_prompt"
import { commands } from "./commands"
import { init_hook_activate, init_hook_set_and_open } from "./init_hook"
import { materialize_project } from "./materialize_project"
import { netlify_projects_dir } from "./netlify_projects_dir"
import { start_dev } from "./start_dev"
import {
  DevelopLocallyOpts,
  ExtraOpts,
  FromCommandInvocation,
  InitAfterReload,
} from "./types"

export class DevelopLocallyServiceW implements Singleton {
  constructor(private ctx: vscode.ExtensionContext) {
    this.setup()
  }
  private setup() {
    vscode.commands.registerCommand(
      commands.develop_locally.command,
      (opts?: NewJamstackProjectSourceString | DevelopLocallyOpts) => {
        const opts2 =
          typeof opts === "object"
            ? opts
            : ({
                action: "FromCommandInvocation",
                sourceStr: opts,
              } as FromCommandInvocation)
        this.start(opts2)
      }
    )
    init_hook_activate()
  }
  start(opts: DevelopLocallyOpts) {
    develop_locally(opts, this.ctx)
  }
}

export function develop_locally(
  opts: DevelopLocallyOpts,
  ctx: vscode.ExtensionContext
) {
  new DevelopLocally(opts, ctx).start()
}

class DevelopLocally {
  constructor(
    private opts: DevelopLocallyOpts,
    private ctx: vscode.ExtensionContext
  ) {}
  @memo() async start() {
    const opts = this.opts
    const { ctx } = this

    if (opts.action === "FromCommandInvocation") {
      const source = await NewJamstackProjectSource_prompt()
      if (!source) return
      reload_and_init({ source, openInNewWindow: true, ctx })
      return
    }

    if (opts.action === "FromNetlifyExplorer") {
      const source = opts.source
        ? NewJamstackProjectSource_parse(opts.source)
        : await NewJamstackProjectSource_prompt()
      if (!source) return
      reload_and_init({ source, openInNewWindow: true, ctx })
      return
    }

    if (opts.action === "FromMagicURL") {
      const source = opts.source
        ? NewJamstackProjectSource_parse(opts.source)
        : await NewJamstackProjectSource_prompt()
      if (!source) return
      const wfs = vscode.workspace.workspaceFolders ?? []
      const openInNewWindow = wfs.length > 0
      reload_and_init({
        source,
        openInNewWindow,
        ctx,
        extraOpts: opts.extraOpts,
      })
      return
    }

    if (opts.action === "InitAfterReload") {
      const { workspaceUri, extraOpts } = opts
      const wf = requireAtLeastOneOpenWorkspace(workspaceUri)
      const source = NewJamstackProjectSource_parse(opts.source)

      hideAll()

      // we should also make sure the panel and the terminals are closed
      // workbench.action.terminal.toggleTerminal

      // TODO: open animation (for now this is totally disconnected)
      // dev_animation_open(this.ctx)

      await materialize_project({ dir: wf.uri.fsPath, source, extraOpts })

      restartEverything()
      // start dev
      await start_dev({ uri: wf.uri, ctx: this.ctx, extraOpts })
      return
    }
  }
}

async function restartEverything() {
  // PERFORMANCE
  // performance can be sluggish at this point
  // (many files changed, some language servers are going nuts at this point)
  // restart ts server - this seems to help
  // if performance becomes an issue at this point, we could also restart the extension host
  // this would restart *this* extension, but with some trickery we could pull it off
  // workbench.action.restartExtensionHost
  try {
    await vscode.commands.executeCommand("typescript.restartTsServer")
  } catch (e) {}
}

async function reload_and_init({
  source,
  dir,
  openInNewWindow,
  ctx,
  extraOpts,
}: {
  source: NewJamstackProjectSource
  dir?: string
  openInNewWindow?: boolean
  ctx: vscode.ExtensionContext
  extraOpts?: ExtraOpts
}) {
  const dev = ctx.extensionMode === vscode.ExtensionMode.Development
  if (dev) {
    openInNewWindow = false // otherwise we would get a window with no extension
    // close any open workspace folders and wait a bit
    const wfs = vscode.workspace.workspaceFolders
    if (wfs && wfs.length > 0) {
      vscode.workspace.updateWorkspaceFolders(0, wfs?.length)
      await wait(1000)
    }
  }
  const dir2 =
    dir ?? NewJamstackProjectSource_autoPickDir(source, netlify_projects_dir())
  const cmd = {
    command: commands.develop_locally.command,
    arguments: [
      {
        action: "InitAfterReload",
        source: source.raw,
        workspaceUri: Uri.file(dir2).toString(),
        extraOpts,
      } as InitAfterReload,
    ],
    title: "init",
  } as Command
  init_hook_set_and_open(dir2, cmd, openInNewWindow)
}

function requireAtLeastOneOpenWorkspace(uri: string) {
  const wf = vscode.workspace.workspaceFolders?.find(
    (wf) => wf.uri.toString() === uri
  )
  if (!wf) throw new Error(`workspace is not currently open: ${uri}`)
  return wf
}

export function hideAll() {
  vscode.commands.executeCommand("workbench.action.closeAllEditors")
  vscode.commands.executeCommand("workbench.action.closePanel")
  vscode.commands.executeCommand("workbench.action.closeSidebar")
}
/*  vscode.window.state.focused
{ "key": "ctrl+cmd+f",            "command": "workbench.action.toggleFullScreen" },
{ "key": "cmd+j",                 "command": "workbench.action.togglePanel" },
{ "key": "cmd+b",                 "command": "workbench.action.toggleSidebarVisibility" },
*/
