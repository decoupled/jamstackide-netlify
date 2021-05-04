import React, { useCallback } from "react"
import vscode from "vscode"
import { TreeItem } from "../../../../vscode/treeview/react2"
import { vscode_ThemeIcon_memo as icon } from "../../../../vscode/vscode_ThemeIcon_memo"

const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState

export const LinkUI = (props: {
  label: string
  url: string
  useVSCodeBrowser?: boolean
}) => {
  const cb = useCallback(() => {
    if (props.useVSCodeBrowser)
      return vscode.commands.executeCommand(
        "browser-preview.openPreview",
        props.url
      )
    vscode.env.openExternal(vscode.Uri.parse(props.url))
  }, [props.url, props.useVSCodeBrowser])
  return (
    <TreeItem
      label={props.label}
      iconPath={icon("link-external")}
      tooltip={props.url}
      select={cb}
      collapsibleState={None}
    />
  )
}
