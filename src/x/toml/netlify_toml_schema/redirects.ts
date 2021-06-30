import * as xlib from "@decoupled/xlib"
import { add_redirect_cmd } from "src/vscode_extension/commands/RightClickCommands"
import { iso3166_countries_jsonSchema } from "x/iso3166/iso3166"
import * as jst from "x/json_schema/json_schema_typings"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as docs from "../netlify_toml_docs"
import { HeaderMap } from "./headers"
import { httpStatusCodes } from "./util"

export const redirects = new jst.TypeW(() => ({
  type: "array",
  items: Redirect,
  "x-docs": docs.urls.redirects,
  "x-menu": ({ filePath, path, value }) => {
    return menus.menu_def2__add__docs.create({
      add: () => {
        add_redirect_cmd.execute(filePath)
      },
      docs: () => {
        xlib
          .vscode_()
          .env.openExternal(xlib.vscode_Uri_smartParse(docs.urls.headers))
      },
    })
  },
}))

const Redirect = new jst.TypeW(() => {
  const roleBased = false
  return {
    type: "object",
    title: "Redirect",
    "x-label": (v: any) => {
      if (typeof v !== "object") return
      if (v === null) return
      const parts: string[] = []
      parts.push(v.from)
      if (v.to) {
        parts.push("->")
        parts.push(v.to)
      }
      if (typeof v.status === "number") {
        parts.push(v.status)
      }
      return parts.join(" ")
    },
    properties: {
      from: { type: "string" },
      to: roleBased ? undefined : { type: "string" },
      status: {
        type: "integer",
        enum: httpStatusCodes().map((x) => x.code),
        description:
          "The default HTTP status code is 301, but you can define a different one",
        "x-taplo": {
          docs: {
            enumValues: httpStatusCodes().map(
              (x) => `HTTP ${x.code}: ${x.name}`
            ),
          },
        },
      },
      force: {
        type: "boolean",
        description: docs.Redirect_force_description,
      },
      query: {
        description: "query parameter mapping",
        type: "object",
        additionalProperties: { type: "string" },
      },
      conditions: {
        type: "object",
        additionalProperties: false,
        properties: {
          Language: conditionArr(),
          Country: Condition_Country,
          Role: conditionArr(),
        },
        required: roleBased ? ["Role"] : [],
      },
      signed: {
        type: "string",
        description:
          "Sign each request with a value defined in an environment variable",
      },
      headers: HeaderMap,
      edge_handler: { type: "string" },
    },
    required: ["from"],
    // required: roleBased ? ["from", "conditions"] : ["from", "to"],
    additionalProperties: false,
    "x-taplo": { initKeys: ["from", "to"] },
  }
})

const Condition_Country = new jst.TypeW(() =>
  iso3166_countries_jsonSchema("Country", "both")
)

function conditionArr(description?: string): jst.T_array {
  return {
    type: "array",
    items: { type: "string" },
    uniqueItems: true,
    minItems: 1,
    description,
  }
}
