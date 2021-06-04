import vscode from "vscode"
import {
  CloseAction,
  ErrorAction,
  ErrorHandler,
  LanguageClientOptions,
} from "vscode-languageclient/node"

export function LanguageClientOptions_build(
  ctx: vscode.ExtensionContext
): LanguageClientOptions {
  const documentSelector = [
    // { scheme: "file", language: "toml", pattern: "netlify.toml" },
    // { scheme: "file", language: "netlifyredirects", pattern: "_redirects" },
    // { scheme: "file", language: "netlifyheaders", pattern: "_headers" },
    { scheme: "file", pattern: "**/*" },
    // { scheme: "file", language: "prisma", pattern: "*.prisma" },
  ]
  // TODO: errors?
  const _errorHandler: ErrorHandler = {
    error(error, message, count) {
      console.log("lsp client connection error", error, message, count)
      return ErrorAction.Shutdown
    },
    closed() {
      return CloseAction.Restart
    },
  }
  return {
    documentSelector,
    diagnosticCollectionName: "Netlify",
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher(
        "**/{netlify.toml,_redirects,_headers}"
      ),
    },
  }
}
