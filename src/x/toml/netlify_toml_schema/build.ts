import * as jst from "x/json_schema/json_schema_typings"
import * as docs from "../netlify_toml_docs"
import { environment } from "./environment"
import { processing } from "./processing"

export const build = new jst.TypeW(() => ({
  "x-no-edit-when-empty": true,
  type: "object",
  description: docs.build_description,
  "x-docs":
    "https://docs.netlify.com/configure-builds/file-based-configuration/#build-settings",
  properties: {
    base: {
      type: "string",
      description: docs.build_base_description,
    },
    publish: {
      type: "string",
      description: docs.build_publish_description,
      "x-resolved-value-from-config": (opts) => {
        const {
          publish: value,
          publishOrigin: origin,
        } = opts.config.config.build
        return { value, origin }
      },
    },
    command: {
      type: "string",
      description: docs.build_command_description,
    },
    environment: environment,
    processing: processing,
    edge_handlers: {
      "x-docs": docs.urls.edge_handlers,
      type: "string",
      description: `Custom path to your Edge Handlers directory`,
    },
    ignore: {
      type: "string",
      description:
        "Bash command that will be run from the base directory to determine whether the site needs rebuilding or not",
      "x-docs": docs.urls.ignore_builds,
    },
  },
  // required: ["command"],
}))
