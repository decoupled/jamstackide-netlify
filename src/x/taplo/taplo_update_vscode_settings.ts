import { join } from "path"
import { fs_patchJSON } from "x/fs/fs_patchJSON"
import { fs_updateJSON } from "x/fs/fs_updateJSON"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_json_schema_generator"

{
  const dir = "/Users/aldo/com.github/decoupled/netlify-vscode-extension"
  taplo_update_vscode_settings(dir)
}

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
