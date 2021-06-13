import * as fs from "fs-extra"
import { fs_patchJSON } from "x/fs/fs_patchJSON"

export async function fs_stashJSONFile(file: string) {
  if (!(await fs.pathExists(file)))
    return {
      async patch() {
        /* noop */
      },
    }
  const data = await fs.readJSON(file)
  await fs.unlink(file)
  return {
    async apply() {
      await fs.writeJSON(file, data)
    },
    async patch() {
      fs_patchJSON(file, data)
    },
  }
}
