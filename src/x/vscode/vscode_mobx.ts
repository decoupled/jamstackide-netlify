import { memoize } from "lodash"
import { makeObservable, observable } from "mobx"
import * as vscode from "vscode"

export const vscode_mobx = memoize(() => new VSCodeMobx())

/**
 * exposes some vscode values in a reactive way.
 * subscribes to events and keeps them updated
 */
class VSCodeMobx {
  constructor() {
    this._activeTextEditor = vscode.window.activeTextEditor
    vscode.window.onDidChangeActiveTextEditor(
      (e) => (this._activeTextEditor = e)
    )

    this._visibleTextEditors = vscode.window.visibleTextEditors
    vscode.window.onDidChangeVisibleTextEditors(
      (e) => (this._visibleTextEditors = e)
    )

    this._workspaceFolders = vscode.workspace.workspaceFolders || []
    vscode.workspace.onDidChangeWorkspaceFolders(
      () => (this._workspaceFolders = vscode.workspace.workspaceFolders || [])
    )
    makeObservable(this)
  }

  get activeTextEditor$$(): vscode.TextEditor | undefined {
    return this._activeTextEditor
  }
  @observable private _activeTextEditor: vscode.TextEditor | undefined

  get visibleTextEditors$$() {
    return this._visibleTextEditors
  }
  @observable private _visibleTextEditors: vscode.TextEditor[]

  get workspaceFolders$$() {
    return this._workspaceFolders
  }
  @observable private _workspaceFolders: readonly vscode.WorkspaceFolder[] = []
}
