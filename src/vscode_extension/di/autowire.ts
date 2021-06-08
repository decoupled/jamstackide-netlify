import * as vscode from "vscode"
import { LanguageClientOptions_build } from "../lsp_client/LanguageClientOptions_build"
import { NetlifyCLIPath } from "../NetlifyCLIPath"
import { autowire__impl } from "./autowire_impl"
import { VSCodeProjectW } from "./VSCodeProjectW"

export function autowire<T>(
  ctx: vscode.ExtensionContext,
  wf: vscode.WorkspaceFolder,
  clipath: NetlifyCLIPath
): VSCodeProjectW {
  extra_deps()
  return autowire__impl(ctx, wf, clipath)
}

function extra_deps() {
  // we want these to be picked up by the DI framework
  ;[LanguageClientOptions_build].forEach(() => {})
}
