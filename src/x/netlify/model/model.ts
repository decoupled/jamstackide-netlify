import { Memoize as memo } from "lodash-decorators"
import simple_git from "simple-git"
import { NetlifyAPIWrapper } from "../api/netlify_api"
import { LazyGetter as lazy } from "lazy-get-decorator"

export class NetlifyWorkspace {
  constructor(
    public opts: { api: NetlifyAPIWrapper; workspaceFolders: string[] }
  ) {}
  @lazy() get projects() {
    return this.opts.workspaceFolders.map(
      (filePath) => new NetlifyProject({ filePath, workspace: this })
    )
  }
}

export class NetlifyProject {
  constructor(public opts: { filePath: string; workspace: NetlifyWorkspace }) {}
  get api() {
    return this.opts.workspace.opts.api
  }
  @memo() async site() {
    const url = await get_origin_push_url(this.opts.filePath)
    if (!url) return
    const site = await this.api.site_by_repo_url(url)
    return site
  }
}

class NetlifyTOML {}
class RedirectsFile {}
class HeadersFile {}
class NetlifyFunction {
  isBackground?: boolean
}

class NetlifySite {}

async function get_origin_push_url(dir: string) {
  const git = simple_git({
    baseDir: dir,
  })
  const remotes = await git.getRemotes(true)
  remotes //?
  //const branches = await git.branchLocal() //?
  /*
[ { name: 'origin',
  refs: 
   { fetch: 'git@github.com:decoupled/netlify-test-site.git',
     push: 'git@github.com:decoupled/netlify-test-site.git' } } ]
  */
  const remote0 = remotes?.[0]
  if (!remote0) return
  const pp = remote0.refs.push
  if (typeof pp !== "string") return
  pp //?
  if (pp.startsWith("https://")) {
    return pp
  }
  if (pp.startsWith("git@github.com:")) {
    // a git URL
    pp //?
    const [__, ...rest] = pp.split(":")
    let url = rest.join(":")
    url = url.substr(0, url.length - 4)
    return "https://github.com/" + url
  }
}
