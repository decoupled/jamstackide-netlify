import React, { useCallback } from "react"
import vscode from "vscode"
import { TreeItem } from "lambdragon"
import { vscode_ThemeIcon_memo as icon } from "src/x/vscode/vscode_ThemeIcon_memo"

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
      collapsibleState={vscode.TreeItemCollapsibleState.None}
    />
  )
}
