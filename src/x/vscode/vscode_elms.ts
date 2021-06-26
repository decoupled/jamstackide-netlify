import * as xlib from "@decoupled/xlib"
import type vscode from "vscode"

// TODO: this should be in xlib. moving it here to move faster
// while we iron out the API

export interface VSCodeCommandOptions {
  command: VSCodeCommandID // "extension.sayHello",
  title?: string // "Hello World",
  category?: string // "Hello",
  icon?: {
    light: string // "path/to/light/icon.svg",
    dark: string // "path/to/dark/icon.svg"
  }
}

export class VSCodeCommand<I extends any[] = [], O = void> {
  constructor(private _opts: MaybeLazy<VSCodeCommandOptions>) {}
  @xlib.lazy()
  private get opts() {
    return MaybeLazy_force(this._opts)
  }
  get command(): string {
    return this.opts.command
  }
  /**
   * register in VSCode
   * @param callback
   * @returns
   */
  register(callback: (...args: I) => O | Promise<O>): vscode.Disposable {
    return xlib.vscode_().commands.registerCommand(this.command, callback)
  }
  execute(...args: I): Thenable<O> {
    return xlib.vscode_().commands.executeCommand(this.command, ...args) as any
  }
  // TODO
  // register_lsp() {
  //   // TODO
  // }
  // execute_lsp() {}

  @xlib.memo() __vscode_contributes__() {
    return { commands: [this.opts] }
  }
}

export class VSCodeMeta {
  constructor(private _opts: MaybeLazy<Record<any, any>>) {}
  @xlib.lazy()
  private get opts() {
    return MaybeLazy_force(this._opts)
  }
  keep() {}
  @xlib.memo() __vscode_contributes__() {
    return this.opts
  }
}

interface VSCodeViewOpts {
  id: string
  name: string
  when?: string
  icon?: string
  contextualTitle?: string
  _container?: string | VSCodeViewContainer
}

export class VSCodeView {
  constructor(private _opts: VSCodeViewOpts) {}
  get id(): VSCodeViewID {
    return this._opts.id
  }
  @xlib.lazy()
  private get opts() {
    return MaybeLazy_force(this._opts)
  }

  @xlib.memo() __vscode_contributes__() {
    let container_id = "explorer"
    const { _container, ...rest } = this.opts
    if (_container) {
      if (typeof _container === "string") container_id = _container
      if (_container instanceof VSCodeViewContainer)
        container_id = _container.id
    }
    return { views: { [container_id]: [rest] } }
  }
}

interface VSCodeViewContainerOpts {
  _parent: "activitybar" | "panel"
  id: VSCodeViewContainerID
  title: string
  icon: string
}

export class VSCodeViewContainer {
  constructor(private _opts: VSCodeViewContainerOpts) {}
  get id(): VSCodeViewContainerID {
    return this._opts.id
  }
  @xlib.lazy()
  private get opts() {
    return MaybeLazy_force(this._opts)
  }

  @xlib.memo() __vscode_contributes__() {
    const { _parent, ...rest } = this.opts
    return { viewsContainers: { [_parent]: [rest] } }
  }
}

type VSCodeCommandID = string
type VSCodeViewID = string
type VSCodeViewContainerID = string

type MaybeLazy<T extends object> = T | (() => T)

function MaybeLazy_force<T extends object>(x: MaybeLazy<T>): T {
  if (typeof x === "function") return (x as any)()
  return x
}
