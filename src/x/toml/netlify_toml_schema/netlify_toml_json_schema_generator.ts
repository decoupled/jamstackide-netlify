import * as jst from "x/json_schema/json_schema_typings"
import { build } from "./build"
import { ContextMap } from "./context"
import { dev } from "./dev"
import { functions } from "./functions"
import { headers } from "./headers"
import { plugins } from "./plugins"
import { redirects } from "./redirects"

export function netlify_toml_json_schema_generate() {
  return schema.validJSONSchema
}

const schema = new jst.DocW(() => ({
  $id: "https://netlify.com/netlif.toml.json",
  $schema: "http://json-schema.org/draft-07/schema",
  title: "Netlify Configuration File",
  type: "object",
  properties: {
    build,
    plugins,
    redirects,
    context: ContextMap,
    headers,
    functions,
    dev,
  },
}))

{
  const rr = schema.validJSONSchema
  JSON.stringify(rr)
}
