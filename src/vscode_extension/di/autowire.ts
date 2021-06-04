import * as vscode from "vscode"
import { NetlifyCLIPath } from "../NetlifyCLIPath"
import { autowire_impl } from "./autowire_impl"
import { VSCodeProjectW } from "./VSCodeProjectW"
export function autowire<T>(
  ctx: vscode.ExtensionContext,
  wf: vscode.WorkspaceFolder,
  clipath: NetlifyCLIPath
): VSCodeProjectW {
  return autowire_impl(ctx, wf, clipath)
}
