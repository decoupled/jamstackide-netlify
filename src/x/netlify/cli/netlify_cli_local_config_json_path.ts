import envPaths from "env-paths"
import * as fs from "fs-extra"
import objectHash from "object-hash"
import os from "os"
import path from "path"

const OSBasedPaths = envPaths("netlify", { suffix: "" })
const NETLIFY_HOME = ".netlify"

// Deprecated method to get netlify's home config - ~/.netlify/...
export function getLegacyPathInHome(paths: string[]) {
  return path.join(os.homedir(), NETLIFY_HOME, ...paths)
}

export function getPathInHome(paths: string[]) {
  return path.join(OSBasedPaths.config, ...paths)
}

/**
 * we don't really need the contents, we just want to be able to know when the contents change
 */
export function netlify_cli_local_config_json_read_hash(): string {
  const configPath = getPathInHome(["config.json"])
  // Legacy config file in home ~/.netlify/config.json
  const legacyPath = getLegacyPathInHome(["config.json"])
  const res = [configPath, legacyPath].map(readJSONOrUndefSync)
  return objectHash({ res })
}

async function readJSONOrUndef(filePath: string) {
  try {
    return await fs.readJSON(filePath)
  } catch (e) {}
  return undefined
}

function readJSONOrUndefSync(filePath: string) {
  try {
    return fs.readJSONSync(filePath)
  } catch (e) {}
  return undefined
}
