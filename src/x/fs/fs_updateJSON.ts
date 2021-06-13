import { outputJSONSync, readJSONSync, unlinkSync } from "fs-extra"
import hash from "object-hash"

/**
 * Updates a JSON file via a callback
 * 
 * @param filePath
 * @param cb
 * @returns
 */
export function fs_updateJSON(
  filePath: string,
  cb: (current: object | undefined) => object | undefined
) {
  let current: object | undefined
  try {
    current = readJSONSync(filePath)
  } catch {}
  const modified = cb(clone(current))
  if (typeof modified === "undefined") {
    // delete
    if (typeof current === "undefined") return // nothing to do
    unlinkSync(filePath)
  } else {
    const current_hash = typeof current === "object" ? hash(current) : undefined
    const modified_hash = hash(modified)
    if (current_hash === modified_hash) return // equivalent
    outputJSONSync(filePath, modified, { spaces: 2 })
  }
  function clone(x) {
    if (typeof x === "undefined") return undefined
    return JSON.parse(JSON.stringify(x))
  }
}
