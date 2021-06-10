import { outputJSONSync, readJSONSync } from "fs-extra"
import hash from "object-hash"

export function fs_outputJSONIfDifferent(filePath: string, data: any) {
  let current: any = undefined
  try {
    current = readJSONSync(filePath)
  } catch {}
  const current_hash =
    typeof current !== "undefined" ? hash(current) : undefined
  const data_hash = hash(data)
  if (current_hash !== data_hash) outputJSONSync(filePath, data)
}
