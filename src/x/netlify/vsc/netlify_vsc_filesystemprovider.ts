import { Singleton } from "lambdragon"
import { toPairs } from "lodash"
import { basename } from "path"
import vscode from "vscode"
import { NetlifyAPIService } from "../api/NetlifyAPIService"

const scheme = "netlify-api"

export class NetlifyVSCodeFileSystemProvider
  implements vscode.FileSystemProvider, Singleton {
  constructor(private api: NetlifyAPIService) {
    vscode.workspace.registerFileSystemProvider(scheme, this)
  }

  private _ee = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
  get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
    return this._ee.event
  }

  private getNetlifyApiOrThrow() {
    try {
      return this.api.getAuthenticatedAPIOrThrow()
    } catch (e) {
      throw vscode.FileSystemError.NoPermissions(e.toString())
    }
  }

  private getSnippet(params: { site_id: string; snippet_id: string }) {
    return this.getNetlifyApiOrThrow().client.getSiteSnippet(params)
  }

  private async getSnippetOrThrow(params: {
    site_id: string
    snippet_id: string
  }) {
    const snip = await this.getSnippet(params)
    if (!snip) throw vscode.FileSystemError.FileNotFound()
    return snip
  }

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    console.log("readFile", uri.toString())
    const parsed = parseuri(uri)
    if (parsed?.type === "snippet") {
      const { site_id, snippet_id } = parsed
      const snip = await this.getSnippetOrThrow({ site_id, snippet_id })
      return Buffer.from(snip.general)
    }
    if (parsed?.type === "env") {
      const { site_id } = parsed
      const env = await this.getNetlifyApiOrThrow().env_get(site_id)
      const txt = toPairs(env)
        .map((kv) => kv.join("="))
        .join("\n")
      return Buffer.from(txt)
    }
    throw vscode.FileSystemError.FileNotFound()
  }

  async writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    _options: { create: boolean; overwrite: boolean }
  ): Promise<void> {
    console.log("writeFile", uri.toString(), Buffer.from(content).toString())
    const parsed = parseuri(uri)
    if (parsed?.type === "snippet") {
      const api = this.getNetlifyApiOrThrow()
      const { site_id, snippet_id } = parsed
      const snip = await this.getSnippetOrThrow({ site_id, snippet_id })
      const general = Buffer.from(content).toString()
      const snip2 = {
        ...snip,
        general,
        // site_id,
        // snippet_id,
        id: Number(snippet_id),
      }
      const dd = {
        site_id,
        snippet_id,
        body: snip2,
      }
      const res = await api.client.updateSiteSnippet(dd)
      this.mark_m(uri)
      this._ee.fire([{ uri, type: vscode.FileChangeType.Changed }])
      console.log("updateSiteSnippet result", res)
    }
    if (parsed?.type === "env") {
      const api = this.getNetlifyApiOrThrow()
      const { site_id } = parsed
      // await api.client2.env_set()
      // this.mark_m(uri)
      // this._ee.fire([{ uri, type: vscode.FileChangeType.Changed }])
      // console.log("updateSiteSnippet result")
    }
    throw vscode.FileSystemError.FileNotFound()
  }

  watch(
    uri: vscode.Uri,
    options: { recursive: boolean; excludes: string[] }
  ): vscode.Disposable {
    console.log("watch", uri.toString())
    //throw new Error("Method not implemented.")
    return { dispose() {} }
  }

  private mtimes = new Map<string, number>()
  private ctimes = new Map<string, number>()
  private get_mtime(uri: vscode.Uri) {
    this.set_if_undef(uri)
    return this.mtimes.get(uri.toString())!
  }
  private get_ctime(uri: vscode.Uri) {
    this.set_if_undef(uri)
    return this.ctimes.get(uri.toString())!
  }
  private mark_m(uri: vscode.Uri) {
    this.set_if_undef(uri)
    this.mtimes.set(uri.toString(), Date.now())
  }
  private set_if_undef(uri: vscode.Uri) {
    const k = uri.toString()
    const c = this.ctimes.get(k)
    if (typeof c === "undefined") {
      const now = Date.now()
      this.ctimes.set(k, now - 2000)
      this.mtimes.set(k, now - 1000)
    }
  }

  async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
    console.log("stat", uri.toString())
    const ctime = this.get_ctime(uri)
    const mtime = this.get_mtime(uri)
    // for now let's say that everything without a . in the basename
    // is a directory
    if (!basename(uri.path).includes(".")) {
      return {
        type: vscode.FileType.Directory,
        ctime,
        mtime,
        size: 0,
      }
    }
    return {
      type: vscode.FileType.File,
      ctime,
      mtime,
      size: (await this.readFile(uri)).byteLength,
    }
  }

  async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
    console.log("readDirectory", uri.toString())
    throw new Error("Method not implemented.")
  }

  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    console.log("createDirectory", uri.toString())
    throw new Error("Method not implemented.")
  }

  delete(
    uri: vscode.Uri,
    options: { recursive: boolean }
  ): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }

  rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    options: { overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
}

type UriData =
  | { type: "env"; site_id: string }
  | { type: "snippet"; site_id: string; snippet_id: string }

function parseuri(uri: vscode.Uri): UriData | undefined {
  if (uri.scheme !== scheme) return undefined
  const parts = uri.path.split("/")
  parts.shift() // should be an empty string
  if (parts[0] === "snippets") {
    const [__, site_id, snippet_id, basename] = parts
    return { type: "snippet", snippet_id, site_id }
  }
  if (parts[0] === "env") {
    // env/789789siteid78978979/.env
    const [__, site_id, basename] = parts
    return { type: "env", site_id }
  }
}
