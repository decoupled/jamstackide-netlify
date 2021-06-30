import * as xlib from "@decoupled/xlib"
import * as jst from "x/json_schema/json_schema_typings"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as docs from "../netlify_toml_docs"
import { environment } from "./environment"
import { plugins } from "./plugins"
import { processing } from "./processing"

export const Context = Context_create()
export const Context_production = Context_create(
  "This context corresponds to the main site’s deployment, attached to the Git branch you set when the site is created"
)

export const Context_deploy_preview = Context_create(
  "This context corresponds to the previews we build for pull/merge requests."
)
export const Context_branch_deploy = Context_create(
  "This context corresponds to deploys from branches that are not the site’s main production branch."
)

export const ContextMap = new jst.TypeW(() => ({
  type: "object",
  "x-sort-keys-with-values-first": true,
  "x-add-button": { label: "add custom context...", handler: () => {} },
  "x-menu": ({ filePath, path, value }) => {
    return menus.menu_def2__add__docs.create({
      add: () => {
        // add_custom_header_cmd.execute(filePath)
      },
      docs: () => {
        xlib
          .vscode_()
          .env.openExternal(xlib.vscode_Uri_smartParse(docs.urls.context))
      },
    })
  },
  properties: {
    production: Context_production,
    "deploy-preview": Context_deploy_preview,
    "branch-deploy": Context_branch_deploy,
  },
  additionalProperties: Context,
}))

function Context_create(description?: string) {
  return new jst.TypeW(() => ({
    "x-no-edit-when-empty": true,
    type: "object",
    properties: {
      base: {
        type: "string",
        description: docs.build_base_description,
      },
      publish: {
        type: "string",
        description: docs.build_publish_description,
      },
      command: {
        type: "string",
        description: docs.build_command_description,
      },
      environment,
      plugins,
      processing,
    },
  }))
}
