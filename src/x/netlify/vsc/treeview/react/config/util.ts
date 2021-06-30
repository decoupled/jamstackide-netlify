import vscode from "vscode"
import { json_schema_resolve_refs_in_place } from "x/json_schema/json_schema_resolve_refs"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_schema/netlify_toml_json_schema_generator"

export function label_description(
  isUndefined: boolean,
  label: string,
  description?: string
) {
  if (!isUndefined) {
    return { label: "  " + label, description }
  } else {
    return { label: "", description: label }
  }
}

// const flatSchema = json_schema_resolve_refs(netlify_toml_json_schema_generate())
export const netlifyTOMLJSONSchema = getSchema() // json_schema_resolve_refs(netlify_toml_json_schema_generate())
function getSchema() {
  const schema = netlify_toml_json_schema_generate()
  json_schema_resolve_refs_in_place(schema)
  return schema
}

const OPEN_DOCS_IN_VSCODE = false
export async function openDocs(url: string) {
  if (!OPEN_DOCS_IN_VSCODE) {
    vscode.env.openExternal(vscode.Uri.parse(url))
  } else {
    const pv = await vscode.commands.executeCommand(
      "browser-preview.openPreview",
      url
    )
  }
}
