import { lazy, memo } from "x/decorators"
import { headers_file_parser22 } from "x/netlify/headers_file/headers_file_parser"
import { URL_toFile } from "x/url/URL_fromFile"
import { ExtendedDiagnostic_findRelevantQuickFixes } from "x/vscode-languageserver-types/lsp_extensions"
import { TextDocument } from "vscode-languageserver-textdocument"
import * as lsp from "vscode-languageserver-types"
import { CodeAction } from "vscode-languageserver-types"
import {
  createConnection,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node"
import { FileSystemWithLSPDocumentStore } from "x/fs/FileSystemWithLSPDocumentStore"
import { Project_create } from "x/netlify/model/Project_create"
import { CommandsManager } from "./commands"
import { DiagnosticsManager } from "./diagnostics"

const SUPPRESS_ERRORS = false

export class NetlifyLanguageServer {
  initializeParams!: InitializeParams
  documents = new TextDocuments(TextDocument)
  @lazy() get connection() {
    const c = createConnection(ProposedFeatures.all)
    // if (SUPPRESS_ERRORS) Connection_suppressErrors(c)
    return c
  }
  @memo() start() {
    process.title = "Netlify Language Server (node)"
    const { connection, documents } = this
    connection.onInitialize((params) => {
      connection.console.log(
        `Netlify Language Server onInitialize(), PID=${process.pid}`
      )
      connection.console.log(JSON.stringify(params))
      this.initializeParams = params
      return {
        capabilities: {
          textDocumentSync: {
            openClose: true,
            change: TextDocumentSyncKind.Full,
          },
          // implementationProvider: true,
          // definitionProvider: true,
          // referencesProvider: true,
          // codeActionProvider: true,
          codeLensProvider: { resolveProvider: false },
          executeCommandProvider: this.commands.options,
          documentSymbolProvider: { label: "Netlify", workDoneProgress: false },
          workspaceSymbolProvider: { workDoneProgress: false },
          // documentLinkProvider: { resolveProvider: false },
          hoverProvider: true,
        },
      } as InitializeResult
    })

    connection.onInitialized(async () => {
      connection.console.log("Netlify Language Server onInitialized() ALDOOO")
      const folders = await connection.workspace.getWorkspaceFolders()
      if (folders) {
        for (const folder of folders) {
          this.projectRoot = URL_toFile(folder.uri)
        }
      }
    })

    // initialize these early on to prevent "unhandled methods"
    // they are smart enough to short-circuit if this.projectRoot is not ready
    this.diagnostics.start()
    this.commands.start()

    connection.onCodeAction(async ({ context, textDocument: { uri } }) => {
      const actions: CodeAction[] = []
      const node = null as any // await this.getProject()?.findNode(uri)
      if (!node) return []
      if (context.diagnostics.length > 0) {
        // find quick-fixes associated to diagnostics
        const xds = await node.collectDiagnostics()
        for (const xd of xds) {
          const as = await ExtendedDiagnostic_findRelevantQuickFixes(
            xd,
            context
          )
          for (const a of as) actions.push(a)
        }
      }
      return actions
    })

    connection.onCodeLens(async ({ textDocument: { uri } }) => {
      if (uri.endsWith("netlify.toml")) {
        const range: lsp.Range = {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
        }
        const d: lsp.CodeLens = {
          range,
          command: {
            command: "netlify.xxx",
            title: "Show Outline",
            arguments: [uri],
          },
        }
        return []
      }

      return []
    })

    connection.onDocumentSymbol(async (params, token) => {
      if (params.textDocument.uri.includes("_headers")) {
        const doc = this.documents.get(params.textDocument.uri)
        const src = doc.getText()
        try {
          return headers_file_parser22(src).symbols
        } catch (e) {
          console.log(e)
        }
      }
      return []
    })
    connection.onWorkspaceSymbol(async (params) => {
      connection.console.log("providing workspace symbols!!!!")
      return []
    })

    connection.onHover(async (p) => {
      connection.console.log("hover" + p.textDocument.uri)
      return null
    })

    connection.onRequest("xxx/decorations", async (uri: lsp.DocumentUri) => {
      if (uri.endsWith("_headers")) {
        const doc = this.documents.get(uri)
        const src = doc.getText()
        try {
          return headers_file_parser22(src).decorations
        } catch (e) {
          console.log(e)
        }
      }
      return []
    })

    // connection.onHover(async ({ textDocument: { uri }, position }) => {
    //   // const info = await this.info(uri, "Hover")
    //   // for (const i of info) {
    //   //   if (Range_contains(i.hover.range!, position)) {
    //   //     return i.hover
    //   //   }
    //   // }
    //   return []
    // })

    documents.listen(connection)
    connection.listen()
  }

  @lazy() get diagnostics() {
    return new DiagnosticsManager(this)
  }
  @lazy() get commands() {
    return new CommandsManager(this)
  }
  @lazy() get host() {
    return new FileSystemWithLSPDocumentStore(this.documents)
  }

  projectRoot: string | undefined
  getProject() {
    if (!this.projectRoot) return undefined
    return Project_create(this.host, this.projectRoot)
  }
  // get vscodeWindowMethods() {
  //   return VSCodeWindowMethods_fromConnection(this.connection)
  // }
  // async collectIDEInfo(uri?: string) {
  //   return (await this.getProject()?.collectIDEInfo(uri)) ?? []
  // }
  // async info<T extends IDEInfo["kind"]>(
  //   uri: string,
  //   kind: T
  // ): Promise<(IDEInfo & { kind: T })[]> {
  //   return (await this.collectIDEInfo(uri)).filter(
  //     (i) => i.kind === kind
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   ) as any
  // }

  get hasWorkspaceFolderCapability() {
    return (
      this.initializeParams.capabilities.workspace?.workspaceFolders === true
    )
  }
}
