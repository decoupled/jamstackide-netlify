export { vscode_ThemeIcon_memo as icon } from "@decoupled/xlib"
export { TreeItem, TreeItem_Menu_create as menu } from "lambdragon"
export { computed, observable } from "mobx"
export { observer } from "mobx-react"

import { ComponentPropsWithoutRef } from "react"
import vscode from "vscode"
export const Expanded = vscode.TreeItemCollapsibleState.Expanded
export const Collapsed = vscode.TreeItemCollapsibleState.Collapsed
export const None = vscode.TreeItemCollapsibleState.None

export type TreeItemProps = ComponentPropsWithoutRef<
  typeof import("lambdragon").TreeItem
>
