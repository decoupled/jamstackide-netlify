import { now } from "mobx-utils"
import { join } from "path"
import React from "react"
import { NetlifyCLIWrapper } from "src/vscode_extension/NetlifyCLIWrapper"
import vscode from "vscode"
import { computed, Expanded, observer, TreeItem } from "./deps"
import { NetlifyTOMLUI } from "./NetlifyTOMLUI"
import { StatusUI } from "./StatusUI"

@observer
export class Main extends React.Component<{
  ctx: vscode.ExtensionContext
  cli: NetlifyCLIWrapper
}> {
  @computed.struct get workspaceFolderURIs(): string[] {
    now(300)
    return vscode.workspace.workspaceFolders.map((x) => x.uri.toString())
  }

  render() {
    const num = this.workspaceFolderURIs.length
    const { ctx, cli } = this.props
    if (num === 0) {
      return (
        <Root>
          <TreeItem label="no workspace folders..." />
        </Root>
      )
    }
    if (num === 1) {
      const wf = vscode.workspace.workspaceFolders[0]
      return (
        <Root>
          <WorkspaceFolderUI
            key={wf.uri.toString()}
            ctx={ctx}
            cli={cli}
            wf={wf}
            isSingleWorkspace={true}
          />
        </Root>
      )
    }

    const folders = this.workspaceFolderURIs.map((x) => {
      return (
        <WorkspaceFolderUI
          key={x}
          ctx={ctx}
          cli={cli}
          wf={
            vscode.workspace.workspaceFolders.find(
              (wf) => wf.uri.toString() === x
            )!
          }
        />
      )
    })
    return <Root>{...folders}</Root>
  }
}

@observer
class WorkspaceFolderUI extends React.Component<{
  ctx: vscode.ExtensionContext
  cli: NetlifyCLIWrapper
  wf: vscode.WorkspaceFolder
  isSingleWorkspace?: boolean
}> {
  render() {
    const { wf, ctx, cli, isSingleWorkspace } = this.props
    const netlify_toml_filePath = join(wf.uri.fsPath, "netlify.toml")

    const content = (
      <>
        <NetlifyTOMLUI ctx={ctx} cli={cli} filePath={netlify_toml_filePath} />
        <StatusUI cli={cli} ctx={ctx} wf={wf} />
      </>
    )
    if (isSingleWorkspace) return content
    return (
      <TreeItem label={"wf: " + wf.name} description={wf.uri.fsPath}>
        {content}
      </TreeItem>
    )
  }
}

const Root = (props: { children: any }) => {
  // return <TreeItem collapsibleState={Expanded}>{props.children}</TreeItem>
  return <>{props.children}</>
}
