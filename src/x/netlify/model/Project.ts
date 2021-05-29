import { join } from "path"
import { memo } from "src/x/decorators"
import { get_origin_push_url } from "src/x/git/get_origin_push_url"
import { ModelNode } from "./base"
import { HeadersFile } from "./HeadersFile"
import { Host } from "./Host"
import { NetlifyTOML } from "./NetlifyTOML"
import { RedirectsFile } from "./RedirectsFile"

export class Project extends ModelNode {
  constructor(public opts: { filePath: string; host: Host }) {
    super()
  }
  get host() {
    return this.opts.host
  }
  get project() {
    return this
  }
  @memo() getChildren() {
    return [this.NetlifyTOML(), this.RedirectsFile(), this.HeadersFile()]
  }
  @memo() getAPIWrapper(): any {
    return null as any
  }
  @memo() async linkedSiteFromAPI() {
    const url = await get_origin_push_url(this.opts.filePath)
    if (!url) return
    const site = await this.getAPIWrapper().site_by_repo_url(url)
    return site
  }
  @memo() NetlifyTOML(): NetlifyTOML | undefined {
    return this.ifFile("netlify.toml", (f) => new NetlifyTOML(this, f))
  }
  @memo() RedirectsFile(): RedirectsFile | undefined {
    return this.ifFile("_redirects", (f) => new RedirectsFile(this, f))
  }
  @memo() HeadersFile(): HeadersFile {
    return this.ifFile("_headers", (f) => new HeadersFile(this, f))
  }
  private ifFile<T>(
    relPath: string,
    ff: (filePath: string) => T
  ): T | undefined {
    const f = join(this.opts.filePath, relPath)
    if (this.host.existsSync(f)) {
      return ff(f)
    }
  }
}

export class NetlifyFunction {
  isBackground?: boolean
}

export class NetlifySite {}
