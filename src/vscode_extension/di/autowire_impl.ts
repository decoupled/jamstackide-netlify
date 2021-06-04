import { VSCodeProjectW } from "./VSCodeProjectW"
import { RedirectsFileW } from "../../x/netlify/redirects_file/RedirectsFileW"
import { CreateFunctionCommand } from "../commands/CreateFunctionCommand"
import { MiniServer } from "../MiniServer"
import { CWD } from "./CWD"
import { NetlifyCLIWrapper } from "../NetlifyCLIWrapper"
import { NetlifyLSPClientManager } from "../lsp_client/NetlifyLSPClientManager"
import { NetlifyLSPClientBuffer } from "../lsp_client/NetlifyLSPClientBuffer"
import { TreeviewDocsW } from "../treeview/docs/TreeviewDocsW"
import { TextEditorDecorations } from "../TextEditorDecorations"
import { TextEditorDecorationsProvider } from "../TextEditorDecorationsProvider"
import { TextEditorDecorationsProviderFromLSPClient } from "../TextEditorDecorationsProviderFromLSPClient"

interface __ResolutionContext {
  params: any[]
  cache: __ValueCache
}

function __ctx__(params: any[]): __ResolutionContext {
  return { params, cache: new __ValueCache() }
}

function __memo__<T extends Function>(f: T, singleton?: boolean): T {
  return function (ctx: __ResolutionContext) {
    let cache = ctx.cache
    if (singleton) cache = __singletonCache
    return cache.get(f, () => f(ctx))
  } as any
}

class __Cache<K, V> {
  private m = new Map<K, V>()
  private running = new Set<K>()
  get(k: K, f: () => V): V {
    if (this.m.has(k)) return this.m.get(k)!
    if (this.running.has(k)) throw new Error("cycle")
    this.running.add(k)
    const v = f()
    this.running.delete(k)
    this.m.set(k, v)
    return v
  }
}
class __ValueCache extends __Cache<Function, any> {}

const __singletonCache = new __ValueCache()

export {}

export function autowire_impl(...params) {
  const ctx = __ctx__(params)
  return __create_VSCodeProjectW(ctx)
}
const __create_RedirectsFileW = __memo__(
  (ctx) => new RedirectsFileW(ctx.params[0]),
  false
)
const __create_MiniServer = __memo__((ctx) => new MiniServer(), true)
const __create_CWD = __memo__((ctx) => new CWD(ctx.params[1]), false)
const __create_NetlifyCLIWrapper = __memo__(
  (ctx) => new NetlifyCLIWrapper(ctx.params[2]),
  false
)
const __create_CreateFunctionCommand = __memo__(
  (ctx) =>
    new CreateFunctionCommand(
      ctx.params[0],
      __create_MiniServer(ctx),
      __create_CWD(ctx),
      __create_NetlifyCLIWrapper(ctx),
      ctx.params[2]
    ),
  false
)
const __create_NetlifyLSPClientBuffer = __memo__(
  (ctx) => new NetlifyLSPClientBuffer(),
  true
)
const __create_NetlifyLSPClientManager = __memo__(
  (ctx) =>
    new NetlifyLSPClientManager(
      ctx.params[0],
      __create_NetlifyLSPClientBuffer(ctx)
    ),
  false
)
const __create_TreeviewDocsW = __memo__((ctx) => new TreeviewDocsW(), true)
const __create_TextEditorDecorationsProviderFromLSPClient = __memo__(
  (ctx) =>
    new TextEditorDecorationsProviderFromLSPClient(
      __create_NetlifyLSPClientBuffer(ctx)
    ),
  false
)
const __create_TextEditorDecorationsProvider = __memo__(
  (ctx) =>
    new TextEditorDecorationsProvider(
      __create_TextEditorDecorationsProviderFromLSPClient(ctx)
    ),
  false
)
const __create_TextEditorDecorations = __memo__(
  (ctx) =>
    new TextEditorDecorations(
      ctx.params[0],
      __create_TextEditorDecorationsProvider(ctx)
    ),
  false
)
const __create_VSCodeProjectW = __memo__(
  (ctx) =>
    new VSCodeProjectW(
      __create_RedirectsFileW(ctx),
      __create_CreateFunctionCommand(ctx),
      __create_NetlifyLSPClientManager(ctx),
      __create_TreeviewDocsW(ctx),
      __create_TextEditorDecorations(ctx)
    ),
  false
)
