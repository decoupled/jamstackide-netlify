export {
  vscode_ThemeIcon_memo as icon,
  vscode_TreeItemMenu as TreeItemMenu,
  vscode_react_TreeItem as TreeItem,
} from "@decoupled/xlib"
export { computed, observable, makeObservable } from "mobx"
export { observer } from "mobx-react"

import { ComponentPropsWithoutRef } from "react"
import vscode from "vscode"
export const Expanded = vscode.TreeItemCollapsibleState.Expanded
export const Collapsed = vscode.TreeItemCollapsibleState.Collapsed
export const None = vscode.TreeItemCollapsibleState.None

import { vscode_react_TreeItem } from "@decoupled/xlib"

export type TreeItemProps = ComponentPropsWithoutRef<
  typeof vscode_react_TreeItem
>
