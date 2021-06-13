import { join } from "path"
import { fs_stashDirContents } from "x/fs/fs_stashDirContents"
import { fs_stashJSONFile } from "x/fs/fs_stashJSONFile"
import { GitURL } from "x/git/GitURL"
import { vscode_run } from "x/vscode/vscode_run"
import { NewProjectSourceSpec } from "../util/NewProjectSourceSpec"
import { TargetDirSpec } from "../util/TargetDirSpec"
import { clone_repo } from "./clone_repo"
import { install_deps } from "./install_deps"
import { ExtraOpts } from "./types"
import { yarn_create_dry } from "./yarn_create"

export async function materialize_project(opts: {
  dir: string
  source: NewProjectSourceSpec
  extraOpts: ExtraOpts
}) {
  const { dir, source, extraOpts } = opts
  const targetDir: TargetDirSpec = {
    kind: "specific",
    dir,
  }

  // copy existing files to a tmp folder.
  // we need to operate on an empty folder
  // otherwise "git clone" and "yarn create" won't work
  const stash = await stashProjectFiles(dir)

  if (source instanceof GitURL) {
    const clone_opts = {
      gitUrl: source,
      targetDir,
      degit: extraOpts?.degit,
    }
    await clone_repo(clone_opts)
    const ok = await install_deps({ dir, extraOpts })
    if (!ok) throw new Error("error installing dependencies")
  } else {
    // yarn create
    const opts = {
      packageName: source,
      targetDir,
    }
    //await yarn_create(opts)
    const rr = await yarn_create_dry(opts)

    const cmdstr2 = rr.cmd + " " + rr.dest
    await vscode_run({ cmd: cmdstr2 })
  }
  // copy files back
  await stash.patch()
}

async function stashProjectFiles(dir: string) {
  const json = await fs_stashJSONFile(join(dir, ".vscode/settings"))
  const rest = await fs_stashDirContents(dir)
  return {
    async patch() {
      await json.patch()
      await rest.apply()
    },
  }
}
