import { ServerOptions, TransportKind } from "vscode-languageclient/node"

/**
 *
 * this should be provided by lambdragon
 * @param module path to the lsp entry point on disk
 */
export function ServerOptions_build(module: string): ServerOptions {
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = {
    execArgv: [
      "--nolazy",
      // "--inspect=6009",
      "--inspect",
    ],
  }
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  return {
    run: { module, transport: TransportKind.ipc },
    debug: {
      module,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  }
}
