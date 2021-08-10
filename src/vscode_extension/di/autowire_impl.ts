import { VSCodeProjectW } from "./VSCodeProjectW"
import { RedirectsFileW } from "../../x/netlify/redirects_file/RedirectsFileW"
import { CreateFunctionCommand } from "../commands/CreateFunctionCommand"
import { NetlifyCLIRPCServer } from "../NetlifyCLIRPCServer"
import { CWD } from "./CWD"
import { NetlifyCLIWrapper } from "../NetlifyCLIWrapper"
import { NetlifyLSPClientManager } from "../lsp_client/NetlifyLSPClientManager"
import { NetlifyLSPClient } from "../lsp_client/NetlifyLSPClient"
import { LanguageClientOptions_build } from "../lsp_client/LanguageClientOptions_build"
import { NetlifyLSPClientBuffer } from "../lsp_client/NetlifyLSPClientBuffer"
import { outputChannel } from "./autowire"
import { TextEditorDecorations } from "../TextEditorDecorations"
import { TextEditorDecorationsProvider } from "../TextEditorDecorationsProvider"
import { TextEditorDecorationsProviderFromLSPClient } from "../TextEditorDecorationsProviderFromLSPClient"
import { SingleTextEditorDecorations } from "../TextEditorDecorations"
import { MagicURLsW } from "../magic_urls/magic_urls"
import { DevelopLocallyServiceW } from "../dev/develop_locally"
import { TreeviewModules } from "../treeview/TreeviewModules"
import { TreeviewShortcutsW } from "../treeview/shortcuts/TreeviewShortcutsW"
import { ReactTreeviewW } from "../../x/netlify/vsc/treeview/react/ReactTreeviewW"
import { NetlifyOAuthManager } from "../../x/netlify/vsc/NetlifyOAuthManager"
import { ConfigTreeviewW } from "../../x/netlify/vsc/treeview/react/config/ConfigTreeviewW"
import { TreeviewWorkflowW } from "../treeview/workflow/TreeviewWorkflowW"
import { Debugging } from "../debugging/Debugging"
import { TaploUpdateW } from "../../x/taplo/TaploUpdateW"
import { RightClickCommands } from "../commands/RightClickCommands"
import { NetlifyTOMLValidatorW } from "../../x/toml/netlify_toml_validator_vsc"
import { Commands } from "../commands/Commands"

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
        "TextEditorDecorations",
        "MagicURLsW",
        "TreeviewModules",
        "Debugging",
        "TaploUpdateW",
        "RightClickCommands",
        "NetlifyTOMLValidatorW",
        "LoginCommand",
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
      isSingleton: true,
      args: [
        "ExtensionContext",
        "NetlifyCLIRPCServer",
        "CWD",
        "NetlifyCLIWrapper",
        "NetlifyCLIPath",
      ],
      impl: CreateFunctionCommand,
    },
    {
      out: "NetlifyCLIRPCServer",
      isConstructor: true,
      isSingleton: true,
      args: [],
      impl: NetlifyCLIRPCServer,
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
        "OutputChannel",
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
    { out: "OutputChannel", isSingleton: true, args: [], impl: outputChannel },
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
      out: "MagicURLsW",
      isConstructor: true,
      isSingleton: true,
      args: ["OutputChannel", "DevelopLocallyServiceW"],
      impl: MagicURLsW,
    },
    {
      out: "DevelopLocallyServiceW",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: DevelopLocallyServiceW,
    },
    {
      out: "TreeviewModules",
      isConstructor: true,
      isSingleton: false,
      args: [
        "TreeviewShortcutsW",
        "ReactTreeviewW",
        "ConfigTreeviewW",
        "TreeviewWorkflowW",
      ],
      impl: TreeviewModules,
    },
    {
      out: "TreeviewShortcutsW",
      isConstructor: true,
      isSingleton: true,
      args: [],
      impl: TreeviewShortcutsW,
    },
    {
      out: "ReactTreeviewW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext", "NetlifyOAuthManager"],
      impl: ReactTreeviewW,
    },
    {
      out: "NetlifyOAuthManager",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: NetlifyOAuthManager,
    },
    {
      out: "ConfigTreeviewW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext", "NetlifyCLIWrapper"],
      impl: ConfigTreeviewW,
    },
    {
      out: "TreeviewWorkflowW",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext"],
      impl: TreeviewWorkflowW,
    },
    {
      out: "Debugging",
      isConstructor: true,
      isSingleton: true,
      args: ["NetlifyCLIPath", "CWD"],
      impl: Debugging,
    },
    {
      out: "TaploUpdateW",
      isConstructor: true,
      isSingleton: false,
      args: ["CWD"],
      impl: TaploUpdateW,
    },
    {
      out: "RightClickCommands",
      isConstructor: true,
      isSingleton: false,
      args: ["WorkspaceFolder"],
      impl: RightClickCommands,
    },
    {
      out: "NetlifyTOMLValidatorW",
      isConstructor: true,
      isSingleton: false,
      args: ["ExtensionContext"],
      impl: NetlifyTOMLValidatorW,
    },
    {
      out: "LoginCommand",
      isConstructor: true,
      isSingleton: true,
      args: ["ExtensionContext", "NetlifyCLIWrapper"],
      impl: Commands,
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
      if (!r) throw new Error("Autowire type not found: " + t)
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
