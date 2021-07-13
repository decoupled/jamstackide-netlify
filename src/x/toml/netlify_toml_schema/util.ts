import Ajv from "ajv"
import { outputFileSync, readJSONSync } from "fs-extra"
import hsc from "http-status-codes"
import _ from "lodash"
import { join } from "path"
import { netlify_toml_json_schema_generate } from "./netlify_toml_json_schema_generator"

export function removeUndefinedProps(x: any) {
  if (typeof x !== "object") return x
  if (x === null) return x
  if (Array.isArray(x))
    return x.filter((xx) => typeof xx !== "undefined").map(removeUndefinedProps)
  const x2 = {}
  for (const k of Object.keys(x)) {
    const v = x[k]
    if (typeof v !== "undefined") x2[k] = removeUndefinedProps(v)
  }
  return x2
}

/**
 * JSON schema compatible regular expression
 * that matches valid file paths
 *
 * @returns
 */
export function file_regex(): string {
  return `
^
  (
    (  / | [\\w-] | \\.  )+
  )+
$`.replace(/\s+/g, "")
}

export function httpStatusCodes() {
  return _.sortBy(Array.from(httpStatusCodes_()), "code")
  function* httpStatusCodes_() {
    for (const name of Object.keys(hsc)) {
      const code = hsc[name]
      if (typeof code !== "number") continue
      yield {
        name,
        code,
        reason: hsc.getStatusText(200),
      }
    }
  }
}

{
  const cc = Array.from(httpStatusCodes())
  _.sortBy(cc, "code")
}

{
  // run this playground to generate the JSON schema, load it into AJV, and then validate an example netlify.toml
  const ajv = new Ajv()
  const schema = netlify_toml_json_schema_generate()
  const validate = ajv.compile(schema)
  const valid = validate(example3_netlify_json())
  valid
  validate.errors
}

function example1_netlify_json() {
  return readJSONSync(join(__dirname, "example1_netlify.json"))
}
function example2_netlify_json() {
  return readJSONSync(join(__dirname, "example2_netlify.json"))
}
function example3_netlify_json() {
  return readJSONSync(join(__dirname, "example3_netlify.json"))
}

{
  // write to .json file
  const ff = join(__dirname, "netlify_toml_json_schema.json")
  const schema = netlify_toml_json_schema_generate()
  false && new Ajv().compile(schema) // <-- this will throw if schema is invalid
  outputFileSync(ff, JSON.stringify(schema, null, 2))
}
