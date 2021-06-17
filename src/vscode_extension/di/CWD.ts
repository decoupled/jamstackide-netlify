import { lazy } from "@decoupled/xlib"
import vscode from "vscode"

export class CWD {
  constructor(private workspaceFolder: vscode.WorkspaceFolder) {}
  @lazy() get x(): string {
    return this.workspaceFolder.uri.fsPath
  }
}
