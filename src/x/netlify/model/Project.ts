import { DIFactory } from "lambdragon"
import { join } from "path"
import { memo } from "x/decorators"
import { get_origin_push_url } from "x/git/get_origin_push_url"
import { IFileSystem } from "x/fs/IFileSystem"
import { FilePath, ModelNode } from "./base"
import { HeadersFile } from "./HeadersFile"
import { NetlifyTOML } from "./NetlifyTOML"
import { ProjectRoot } from "./ProjectRoot"
import { RedirectsFile } from "./RedirectsFile"

export class Project extends ModelNode {
  constructor(
    public projectRoot: ProjectRoot,
    public fs: IFileSystem,
    private NetlifyTOML_F: DIFactory<typeof NetlifyTOML, [FilePath]>,
    private RedirectsFile_F: DIFactory<typeof RedirectsFile, [FilePath]>,
    private HeadersFile_F: DIFactory<typeof HeadersFile, [FilePath]>
  ) {
    super()
  }
  @memo() getChildren() {
    return [this.NetlifyTOML(), this.RedirectsFile(), this.HeadersFile()]
  }
  @memo() getAPIWrapper(): any {
    return null as any
  }
  @memo() async linkedSiteFromAPI() {
    const url = await get_origin_push_url(this.projectRoot)
    if (!url) return
    const site = await this.getAPIWrapper().site_by_repo_url(url)
    return site
  }
  @memo() NetlifyTOML(): NetlifyTOML | undefined {
    return this.ifFile("netlify.toml", (f) => this.NetlifyTOML_F(f))
  }
  @memo() RedirectsFile(): RedirectsFile | undefined {
    return this.ifFile("_redirects", (f) => this.RedirectsFile_F(f))
  }
  @memo() HeadersFile(): HeadersFile | undefined {
    return this.ifFile("_headers", (f) => this.HeadersFile_F(f))
  }
  private ifFile<T>(
    relPath: string,
    ff: (filePath: string) => T
  ): T | undefined {
    const f = join(this.projectRoot, relPath)
    if (this.fs.existsSync(f)) {
      return ff(f)
    }
  }
}

export class NetlifyFunction {
  isBackground?: boolean
}

export class NetlifySite {}
