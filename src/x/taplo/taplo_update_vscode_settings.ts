import { fs_patchJSON, fs_updateJSON } from "@decoupled/xlib"
import { join } from "path"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_schema/netlify_toml_json_schema_generator"

{
  const dir = "/Users/aldo/com.github/decoupled/netlify-vscode-extension"
  taplo_update_vscode_settings(dir)
}

/**
 * This function will
 * - Create JSON schema and store it in .netlify
 * - Modify .vscode/settings.json#evenBetterToml.schema.associations
 *   so it is used by Even Better TOML for netlify.toml files
 */
export function taplo_update_vscode_settings(dir: string) {
  const fff = ".netlify/netlify.toml.schema.json"
  // 1. create JSON schema and store it in .netlify
  fs_updateJSON(f(fff), () => netlify_toml_json_schema_generate())
  // 2. configure Even Better TOML extension to use it
  const patch = {
    "evenBetterToml.schema.associations": {
      ".*netlify\\.toml": "./" + fff,
    },
  }
  fs_patchJSON(f(".vscode/settings.json"), patch)
  function f(x: string) {
    return join(dir, x)
  }
}
