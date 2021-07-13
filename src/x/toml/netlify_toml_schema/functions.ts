import * as xlib from "@decoupled/xlib"
import { create_function_cmd } from "src/vscode_extension/commands/CreateFunctionCommand"
import * as jst from "x/json_schema/json_schema_typings"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as docs from "../netlify_toml_docs"
import { file_regex } from "./util"

export const functions = new jst.TypeW(() => ({
  type: "object",
  description: `Configuration for Netlify Functions. [Docs](https://docs.netlify.com/configure-builds/file-based-configuration/#functions)`,
  "x-docs":
    "https://docs.netlify.com/configure-builds/file-based-configuration/#functions",
  properties: {
    directory: {
      type: "string",
      description: "Sets a custom directory for Netlify Functions",
      pattern: file_regex(),
      "x-resolved-value-from-config": (opts) => {
        const {
          functionsDirectory: value,
          functionsDirectoryOrigin: origin,
        } = opts.config.config
        return { value, origin }
      },
    },
    node_bundler,
    external_node_modules,
    included_files,
  },
  additionalProperties: FunctionOverrides,
  "x-menu": ({ filePath, path, value }) => {
    return menus.menu_def2__functions.create({
      add: () => {
        // executeCommand(
        //   netlify_ids.netlify.commands.create_function_config.$id
        // )
      },
      add2: () => {
        // executeCommand(
        //   netlify_ids.netlify.commands.create_function_config.$id
        // )
      },
      create_new_function: () => {
        create_function_cmd.execute()
        // executeCommand(netlify_ids.netlify.commands.create_function.$id)
      },
      debug: () => {
        // executeCommand(netlify_ids.netlify.commands.debug.$id)
      },
      debug2: () => {
        // executeCommand(netlify_ids.netlify.commands.debug.$id)
      },
      docs: () => {
        xlib
          .vscode_()
          .env.openExternal(xlib.vscode_Uri_smartParse(docs.urls.headers))
      },
    })
  },
}))

const FunctionOverrides = new jst.TypeW(() => ({
  type: "object",
  properties: {
    external_node_modules,
    included_files,
  },
}))

const external_node_modules = new jst.TypeW(() => ({
  description: docs.Functions__external_node_modules__d,
  type: "array",
  items: { type: "string" },
}))

const included_files = new jst.TypeW(() => ({
  description: docs.Functions__included_files__d,
  type: "array",
  items: { type: "string" },
}))

const node_bundler = new jst.TypeW(() => ({
  type: "string",
  enum: ["esbuild", "zisi"],
  description: "The function bundling method used",
  "x-taplo": {
    docs: {
      enumValues: [docs.esbuild, docs.zisi],
    },
  },
}))
