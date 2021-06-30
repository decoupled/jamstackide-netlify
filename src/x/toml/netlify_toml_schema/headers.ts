import * as xlib from "@decoupled/xlib"
import { add_custom_header_cmd } from "src/vscode_extension/commands/RightClickCommands"
import * as jst from "x/json_schema/json_schema_typings"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as docs from "../netlify_toml_docs"

export const headers = new jst.TypeW(() => ({
  type: "array",
  "x-docs": docs.urls.headers,
  items: {
    type: "object",
    title: "HeaderSet",
    "x-label": (v) => {
      if (v?.for) return `${v.for}`
    },
    properties: {
      for: { type: "string" },
      values: HeaderMap,
    },
    required: ["for", "values"],
  },
  "x-menu": ({ filePath, path, value }) => {
    return menus.menu_def2__add__docs.create({
      add: () => {
        add_custom_header_cmd.execute(filePath)
      },
      docs: () => {
        xlib
          .vscode_()
          .env.openExternal(xlib.vscode_Uri_smartParse(docs.urls.headers))
      },
    })
  },
}))

export const HeaderMap = new jst.TypeW(() => ({
  description: "Custom Header Values",
  type: "object",
  properties: {
    "X-Frame-Options": { enum: ["DENY", "SAMEORIGIN"], type: "string" },
    "X-XSS-Protection": { type: "string" },
    "Content-Security-Policy": { type: "string" },
    Link: { type: "string" },
    "Basic-Auth": {
      type: "string",
      description:
        "Basic-Auth allows you to password protect your whole site but is only available to paid accounts",
    },
    "X-From": { type: "string" },
    "X-Api-Key": { type: "string" },
  },
  additionalProperties: { type: "string" },
  "x-sort-keys-with-values-first": true,
  "x-add-button": { label: "add custom header...", handler: () => {} },
}))
