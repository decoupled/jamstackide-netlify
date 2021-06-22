import React from "react"
import { NetlifyCLIWrapper } from "src/vscode_extension/NetlifyCLIWrapper"
import type vscode from "vscode"

interface CtxData {
  ctx: vscode.ExtensionContext
  cli: NetlifyCLIWrapper
  wf: vscode.WorkspaceFolder
}
interface Ctx {
  getOrFail(): CtxData
}


export const R_vscode_ExtensionContext = React.createContext<vscode.ExtensionContext>(
  undefined
)

const ctx = React.createContext<Ctx>({
  getOrFail() {
    throw new Error("context not set")
  },
})

const MyApp = () => {
  const ctx: vscode.ExtensionContext = null as any
  return (
    <div>
      <R_vscode_ExtensionContext.Provider
        value={ctx}
      ></R_vscode_ExtensionContext.Provider>
    </div>
  )
}
