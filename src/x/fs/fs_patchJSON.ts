import { merge } from "webpack-merge"
import { fs_updateJSON } from "./fs_updateJSON"

/**
 * Patches a JSON file using webpack-merge
 * If the file does not exist, it is created
 * @param filePath
 * @param patch
 */
export function fs_patchJSON(filePath: string, patch: object) {
  fs_updateJSON(filePath, (data) => merge(data ?? {}, patch))
}
