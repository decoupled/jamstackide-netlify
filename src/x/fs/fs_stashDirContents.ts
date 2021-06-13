import * as fs from "fs-extra"
import * as tmp from "tmp"

export async function fs_stashDirContents(dir: string) {
  const tmpf = tmp.dirSync()
  await fs.ensureDir(dir)
  await fs.copy(dir, tmpf.name)
  await fs.emptyDir(dir)
  return {
    async apply() {
      await fs.copy(tmpf.name, dir)
      tmpf.removeCallback()
    },
  }
}
