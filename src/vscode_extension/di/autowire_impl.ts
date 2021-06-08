import { VSCodeProjectW } from "./VSCodeProjectW"
import { RedirectsFileW } from "../../x/netlify/redirects_file/RedirectsFileW"
import { CreateFunctionCommand } from "../commands/CreateFunctionCommand"
import { MiniServer } from "../MiniServer"
import { CWD } from "./CWD"
import { NetlifyCLIWrapper } from "../NetlifyCLIWrapper"
import { NetlifyCLIPath } from "../NetlifyCLIPath"
import { NetlifyLSPClientManager } from "../lsp_client/NetlifyLSPClientManager"
import { NetlifyLSPClient } from "../lsp_client/NetlifyLSPClient"
import { LanguageClientOptions_build } from "../lsp_client/LanguageClientOptions_build"
import { NetlifyLSPClientBuffer } from "../lsp_client/NetlifyLSPClientBuffer"
import { TreeviewDocsW } from "../treeview/docs/TreeviewDocsW"
import { TextEditorDecorations } from "../TextEditorDecorations"
import { TextEditorDecorationsProvider } from "../TextEditorDecorationsProvider"
import { TextEditorDecorationsProviderFromLSPClient } from "../TextEditorDecorationsProviderFromLSPClient"
import { SingleTextEditorDecorations } from "../TextEditorDecorations"
import { ReactTreeviewW } from "../../x/netlify/vsc/treeview/react/ReactTreeviewW"
import { NetlifyTokenManager } from "../../x/netlify/vsc/netlify_vsc_oauth_manager"
import { TreeviewOutlineW } from "../treeview/outline/TreeviewOutlineW"
import { MagicURLsW } from "../magic_urls/magic_urls"
import { outputChannel } from "./autowire"
import { DevelopLocallyServiceW } from "../dev/develop_locally"
import { TreeviewWorkflowW } from "../treeview/workflow/TreeviewWorkflowW"

export const autowire__impl = ___autowire__(
  "VSCodeProjectW",
  ["ExtensionContext", "WorkspaceFolder", "NetlifyCLIPath"],
  [
    {
      out: "VSCodeProjectW",
      isConstructor: true,
      isSingleton: false,
      args: [
        "RedirectsFileW",
        "CreateFunctionCommand",
        "NetlifyLSPClientManager",
        "TreeviewDocsW",
        "TextEditorDecorations",
        "ReactTreeviewW",
        "TreeviewOutlineW",
        "MagicURLsW",
        "TreeviewWorkflowW",
      ],
      impl: VSCodeProjectW,
    },
    {
      out: "RedirectsFileW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext"],
      impl: RedirectsFileW,
    },
    {
      out: "CreateFunctionCommand",
      isConstructor: true,
      isSingleton: false,
      args: [
        "ExtensionContext",
        "MiniServer",
        "CWD",
        "NetlifyCLIWrapper",
        "NetlifyCLIPath",
      ],
      impl: CreateFunctionCommand,
    },
    {
      out: "MiniServer",
      isConstructor: true,
      isSingleton: true,
      args: [],
      impl: MiniServer,
    },
    {
      out: "CWD",
      isConstructor: true,
      isSingleton: false,
      args: ["WorkspaceFolder"],
      impl: CWD,
    },
    {
      out: "NetlifyCLIWrapper",
      isConstructor: true,
      isSingleton: false,
      args: ["NetlifyCLIPath"],
      impl: NetlifyCLIWrapper,
    },
    {
      out: "NetlifyCLIPath",
      isConstructor: true,
      isSingleton: false,
      args: ["string"],
      impl: NetlifyCLIPath,
    },
    {
      out: "NetlifyLSPClientManager",
      isConstructor: true,
      isSingleton: false,
      args: [
        "ExtensionContext",
        { type: "NetlifyLSPClient", overrides: ["ServerOptions"] },
      ],
      impl: NetlifyLSPClientManager,
    },
    {
      out: "NetlifyLSPClient",
      isConstructor: true,
      isSingleton: false,
      args: [
        "ServerOptions",
        "LanguageClientOptions",
        "NetlifyLSPClientBuffer",
      ],
      impl: NetlifyLSPClient,
    },
    {
      out: "LanguageClientOptions",
      isSingleton: false,
      args: ["ExtensionContext"],
      impl: LanguageClientOptions_build,
    },
    {
      out: "NetlifyLSPClientBuffer",
      isConstructor: true,
      isSingleton: true,
      args: [],
      impl: NetlifyLSPClientBuffer,
    },
    {
      out: "TreeviewDocsW",
      isConstructor: true,
      isSingleton: true,
      args: [],
      impl: TreeviewDocsW,
    },
    {
      out: "TextEditorDecorations",
      isConstructor: true,
      isSingleton: false,
      args: [
        "ExtensionContext",
        "TextEditorDecorationsProvider",
        { type: "SingleTextEditorDecorations", overrides: ["TextEditor"] },
      ],
      impl: TextEditorDecorations,
    },
    {
      out: "TextEditorDecorationsProvider",
      isConstructor: true,
      isSingleton: false,
      args: ["TextEditorDecorationsProviderFromLSPClient"],
      impl: TextEditorDecorationsProvider,
    },
    {
      out: "TextEditorDecorationsProviderFromLSPClient",
      isConstructor: true,
      isSingleton: false,
      args: ["NetlifyLSPClientBuffer"],
      impl: TextEditorDecorationsProviderFromLSPClient,
    },
    {
      out: "SingleTextEditorDecorations",
      isConstructor: true,
      isSingleton: false,
      args: ["TextEditor", "TextEditorDecorationsProvider"],
      impl: SingleTextEditorDecorations,
    },
    {
      out: "ReactTreeviewW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext", "NetlifyTokenManager"],
      impl: ReactTreeviewW,
    },
    {
      out: "NetlifyTokenManager",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: NetlifyTokenManager,
    },
    {
      out: "TreeviewOutlineW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext", "NetlifyLSPClientBuffer"],
      impl: TreeviewOutlineW,
    },
    {
      out: "MagicURLsW",
      isConstructor: true,
      isSingleton: true,
      args: ["OutputChannel", "DevelopLocallyServiceW"],
      impl: MagicURLsW,
    },
    { out: "OutputChannel", isSingleton: true, args: [], impl: outputChannel },
    {
      out: "DevelopLocallyServiceW",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: DevelopLocallyServiceW,
    },
    {
      out: "TreeviewWorkflowW",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: TreeviewWorkflowW,
    },
  ]
)

function ___autowire__(t, o, rules) {
  type TypeID = any
  type RuleDef = any
  class Ctx {
    constructor(
      private rules: RuleDef[],
      private overrides = new Map<TypeID, any>(),
      private parent?: Ctx
    ) {}
    cache = new Map<TypeID, any>()
    solve(t: TypeID) {
      if (this.overrides.has(t)) return this.overrides.get(t)
      if (this.parent) return this.parent.solve(t)
      const r = this.rules.find(({ out }) => out === t)
      if (!r) throw new Error("not found")
      if (r.isSingleton)
        if (Ctx.singletonCache.has(t)) return Ctx.singletonCache.get(t)

      const args = (r.args ?? []).map((arg) => {
        if (arg === "undefined") return undefined
        if (typeof arg === "object")
          return this.createFactory(arg.type, arg.overrides)
        return this.solve(arg)
      })
      const v = r.isConstructor ? new r.impl(...args) : r.impl(...args)
      if (r.isSingleton) Ctx.singletonCache.set(t, v)
      return v
    }
    createFactory(t: TypeID, overrideTypes: TypeID[]) {
      return (...args: any[]) => {
        const overrides2 = new Map(this.overrides)
        for (const [i, ot] of overrideTypes.entries())
          overrides2.set(ot, args[i])
        const ctx2 = new Ctx(this.rules, overrides2)
        return ctx2.solve(t)
      }
    }
    private static singletonCache = new Map<TypeID, any>()
  }
  return new Ctx(rules).createFactory(t, o)
}
