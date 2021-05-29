import { lazy, memo } from "src/x/decorators"
import { Project } from "src/x/netlify/model/Project"
import { URL_toFile } from "src/x/url/URL_fromFile"
import { ExtendedDiagnostic_findRelevantQuickFixes } from "src/x/vscode-languageserver-types/lsp_extensions"
// import { URL_toFile } from "src/x/url/URL_toFile"
// import { VSCodeWindowMethods_fromConnection } from "src/x/vscode"
// import { Connection_suppressErrors } from "src/x/vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"
import { CodeAction } from "vscode-languageserver-types"
import {
  createConnection,
  InitializeParams,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node"
import { CommandsManager } from "./commands"
import { DiagnosticsManager } from "./diagnostics"
import { HostWithDocumentsStore } from "./HostWithDocumentsStore"

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
    const { connection, documents } = this
    connection.onInitialize((params) => {
      connection.console.log(
        `Netlify Language Server onInitialize(), PID=${process.pid}`
      )
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
          codeActionProvider: true,
          codeLensProvider: { resolveProvider: false },
          executeCommandProvider: this.commands.options,
          // documentLinkProvider: { resolveProvider: false },
          // hoverProvider: true,
        },
      }
    })

    connection.onInitialized(async () => {
      connection.console.log("Netlify Language Server onInitialized()")
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
    // this.outline.start()
    // this.xmethods.start()

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
      // return (await this.info(uri, "CodeLens")).map((i) => i.codeLens)
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
  // @lazy() get outline() {
  //   return new OutlineManager(this)
  // }
  // @lazy() get xmethods() {
  //   return new XMethodsManager(this)
  // }
  @lazy() get host() {
    return new HostWithDocumentsStore(this.documents)
  }

  projectRoot: string | undefined
  getProject(): Project | undefined {
    if (!this.projectRoot) return undefined
    return new Project({ filePath: this.projectRoot, host: this.host })
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
