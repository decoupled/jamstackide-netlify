import { join } from "path"
import vscode from "vscode"
import { netlify_cli_modified_install_vscode } from "x/netlify/cli/netlify_cli_modified"

export interface NetlifyCLIPath {
  standard(): Promise<string>
  withIDESupport(): Promise<string>
  withFunctionsDebuggingSupport(): Promise<string>
}

export function NetlifyCLIPath_createForExtension(
  ctx: vscode.ExtensionContext
): NetlifyCLIPath {
  // this will start the process right away
  // it will keep downloading in the background
  const modified = getModified()
  return {
    standard() {
      return modified
    },
    withFunctionsDebuggingSupport() {
      return modified
    },
    withIDESupport() {
      return modified
    },
  }
  async function getModified() {
    const dir = await netlify_cli_modified_install_vscode(ctx)
    return join(dir, "bin", "run")
  }
}

export function NetlifyCLIPath_createDevTime(): NetlifyCLIPath {
  return {
    async standard() {
      return local_aldo
    },
    async withFunctionsDebuggingSupport() {
      return local_aldo
    },
    async withIDESupport() {
      return local_aldo
    },
  }
}

const local_aldo = "/Users/aldo/com.github/decoupled/netlify-cli/bin/run"
