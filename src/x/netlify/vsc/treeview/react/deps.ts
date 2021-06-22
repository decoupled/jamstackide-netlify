export {
  vscode_react_TreeItem as TreeItem,
  vscode_react_TreeItem_render as TreeItem_render,
  vscode_ThemeIcon_memo as icon,
  vscode_TreeItemMenu as TreeItemMenu,
} from "@decoupled/xlib"
export { computed, makeObservable, observable } from "mobx"
export { observer } from "mobx-react"

import { ComponentPropsWithoutRef } from "react"
import vscode from "vscode"
export const Expanded = vscode.TreeItemCollapsibleState.Expanded
export const Collapsed = vscode.TreeItemCollapsibleState.Collapsed
export const None = vscode.TreeItemCollapsibleState.None

export type TreeItemProps = ComponentPropsWithoutRef<
  typeof import("@decoupled/xlib").vscode_react_TreeItem
>
