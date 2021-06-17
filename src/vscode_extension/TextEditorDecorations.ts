import { vscode_TextEditor_setDecorations_pivot } from "@decoupled/xlib"
import { DIFactory } from "lambdragon"
import { Throttle } from "lodash-decorators"
import * as vscode from "vscode"
import { Map_WithLifecycle } from "@decoupled/xlib"
import { TextEditorDecorationsProvider } from "./TextEditorDecorationsProvider"

export class TextEditorDecorations {
  constructor(
    public ctx: vscode.ExtensionContext,
    public provider: TextEditorDecorationsProvider,
    private factory: DIFactory<
      typeof SingleTextEditorDecorations,
      [vscode.TextEditor]
    >
  ) {
    this.start()
  }

  private start(): void {
    const cache = new Map_WithLifecycle<
      vscode.TextEditor,
      SingleTextEditorDecorations
    >({
      create: (textEditor) => this.factory(textEditor),
      dispose: (manager) => manager.dispose(),
    })
    cache.update(vscode.window.visibleTextEditors)
    const d = vscode.window.onDidChangeVisibleTextEditors((e) =>
      cache.update(e)
    )
    const dd = new vscode.Disposable(() => {
      d.dispose()
      cache.update([])
    })
    this.ctx.subscriptions.push(dd)
  }
}

export class SingleTextEditorDecorations implements vscode.Disposable {
  private subscriptions: vscode.Disposable[] = []
  constructor(
    public editor: vscode.TextEditor,
    public provider: TextEditorDecorationsProvider // public parent: TextEditorDecorations
  ) {
    this.init()
  }

  private init() {
    // if (
    //   !RegExp_hasExtension_ts_tsx_js_jsx_json.test(
    //     this.editor.document.uri.fsPath
    //   )
    // )
    //   return
    vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === this.uri.toString()) this.update()
      },
      undefined,
      this.subscriptions
    )
    this.update()
  }

  get uri() {
    return this.editor.document.uri
  }

  // TODO: ThrottleAync
  @Throttle(100, { leading: true })
  private async update() {
    const { provider } = this
    vscode_TextEditor_setDecorations_pivot(
      this.editor,
      provider.getAllDecorationTypes(),
      await provider.getDecorationsForDoc(this.uri)
    )
  }

  dispose() {
    this.subscriptions.forEach((s) => s.dispose())
  }
}
