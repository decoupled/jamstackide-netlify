import * as xlib from "@decoupled/xlib"
import { vscode_workspace_applyEdit2 } from "@decoupled/xlib"
import * as fs from "fs-extra"
import { reaction, transaction } from "mobx"
import { now } from "mobx-utils"
import { experimental_enabled } from "src/vscode_extension/util/experimental_enabled"
import * as toml from "toml"
import vscode from "vscode"
import { netlify_toml_inserts_insertPath_vscode } from "x/toml/netlify_toml_inserts"
import { vscode_mobx } from "x/vscode/vscode_mobx"
import { computed, makeObservable, observable } from "./deps"
export class NetlifyTOMLUIModel {
  constructor(private filePath: string) {
    reaction(
      () => this.text,
      (txt) => {
        process.nextTick(() => {
          // we shouldn't modify observables within a reaction
          // so we just push it out of the loop
          // alternative: we could use rxjs streams (+ mobx)
          transaction(() => {
            if (typeof txt !== "string") {
              this.parsedDoc = null
              this.isStale = false
              return
            }
            try {
              const parsed = toml.parse(txt)
              this.parsedDoc = parsed
              this.isStale = false
            } catch (e) {
              console.log(e)
              this.isStale = true
            }
          })
        })
      },
      { fireImmediately: true }
    )
    makeObservable(this)
  }
  @observable parsedDoc: any = null
  /**
   * the parsed doc can be stale (if there is a syntax error, for example)
   */
  @observable isStale = false

  @computed get hasSyntaxErrors() {
    return this.parsedDoc && this.isStale
  }

  @computed get experimental_enabled() {
    now(500)
    return experimental_enabled()
  }

  @computed get isActive() {
    return (
      vscode_mobx().activeTextEditor$$?.document?.uri?.fsPath === this.filePath
    )
  }

  @computed get exists() {
    now(300)
    return this._exists
  }

  private get _exists() {
    return fs.existsSync(this.filePath)
  }

  @computed get text(): string | undefined {
    now(300)
    return this._text
  }

  private get _text(): string | undefined {
    if (!this._exists) return undefined
    return this.doc?.getText() ?? fs.readFileSync(this.filePath).toString()
  }

  @computed get doc(): vscode.TextDocument | undefined {
    now(200)
    return this._doc
  }
  private get _doc(): vscode.TextDocument | undefined {
    return vscode.workspace.textDocuments.find(
      (x) => x.uri.fsPath === this.filePath
    )
  }

  get editor(): vscode.TextEditor | undefined {
    return vscode.window.visibleTextEditors.find(
      (x) => x.document.uri.fsPath === this.filePath
    )
  }

  get uri() {
    return vscode.Uri.file(this.filePath)
  }
  focus = (preserveFocus = true) => {
    vscode.window.showTextDocument(this.uri, { preserveFocus })
  }
  __onSelect = (path: (string | number)[]) => {
    this.focus()
    const nn = xlib.toml_path_to_range(this.text, path.concat())
    if (!nn) return
    const range = xlib.Range_iso.reverseGet(nn)
    const selection = new vscode.Selection(range.start, range.end)
    vscode.window.showTextDocument(this.uri, { selection, preserveFocus: true })
  }
  __onEdit = (path: (string | number)[]) => {
    if (path.some((x) => typeof x !== "string")) {
      vscode.window.showWarningMessage("Editing TOML arrays not supported yet")
    }
    this.focus(false)
    const editor = this.editor
    if (!editor) return
    netlify_toml_inserts_insertPath_vscode(editor, path as any)
  }

  createNewNetlifyTOML = () => {
    const files = new Map<string, string>()
    files.set(this.filePath, "")
    vscode_workspace_applyEdit2({ files, save: true })
    vscode.window.showTextDocument(this.uri)
  }
}
