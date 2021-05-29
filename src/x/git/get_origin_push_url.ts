import simple_git from "simple-git"

export async function get_origin_push_url(dir: string) {
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
