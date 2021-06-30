import * as jst from "x/json_schema/json_schema_typings"
import * as docs from "../netlify_toml_docs"

export const plugins = new jst.TypeW(() => ({
  type: "array",
  items: Plugin,
  description: "Build Plugins",
  "x-docs":
    "https://docs.netlify.com/configure-builds/file-based-configuration/#build-plugins",
  title: "Plugins",
}))

const Plugin = new jst.TypeW(() => ({
  type: "object",
  title: "Plugin",
  "x-label": (v) => {
    const p = v?.package
    if (typeof p === "string") return p
  },
  description: `[Docs](https://docs.netlify.com/configure-builds/build-plugins/#configure-settings)`,
  properties: {
    package: {
      type: "string",
      description: docs.Plugin_package_description,
    },
    inputs: PluginInputs,
  },
  required: ["package"],
}))

const PluginInputs = new jst.TypeW(() => ({
  description: "Custom Settings for Plugin",
  type: "object",
  additionalProperties: { type: "string" },
}))
