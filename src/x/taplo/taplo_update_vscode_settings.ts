import { outputJSONSync, readJSONSync, unlinkSync } from "fs-extra"
import hash from "object-hash"
import { join } from "path"
import { merge } from "webpack-merge"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_json_schema_generator"

{
  const dir = "/Users/aldo/com.github/decoupled/netlify-vscode-extension"
  taplo_update_vscode_settings(dir)
}

export function taplo_update_vscode_settings(dir: string) {
  const fff = ".netlify/netlify.toml.schema.json"
  updateJSON(f(fff), () => netlify_toml_json_schema_generate())
  const patch = {
    "evenBetterToml.schema.associations": {
      ".*netlify\\.toml": "./" + ".netlify/netlify.toml.schema.json",
    },
  }
  patchJSON(f(".vscode/settings.json"), patch)
  function f(x: string) {
    return join(dir, x)
  }
}

{
  const filePath =
    "/Users/aldo/com.github/decoupled/netlify-vscode-extension/src/x/taplo/foo.json"
  patchJSON(filePath, { x: { z: "z" } })
}

function patchJSON(filePath: string, patch: object) {
  updateJSON(filePath, (data) => merge(data ?? {}, patch))
}

function updateJSON(
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
