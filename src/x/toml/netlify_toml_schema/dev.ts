import * as jst from "x/json_schema/json_schema_typings"
import * as docs from "../netlify_toml_docs"
import { file_regex } from "./util"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as xlib from "@decoupled/xlib"
import { icon_uri } from "x/netlify/vsc/treeview/react/icon_uri"

export const dev = new jst.TypeW(() => ({
  type: "object",
  "x-no-edit-when-empty": true,
  "x-icon": ({ value, ctx }) => {
    const icon = dev_framework_icon[value?.framework ?? "____"]
    if (typeof icon !== "string") return undefined
    return icon_uri(icon, ctx)
  },
  description: "Configuration for Netlify Dev",
  "x-docs":
    "https://docs.netlify.com/configure-builds/file-based-configuration/#netlify-dev",
  properties: {
    command: {
      type: "string",
      description: "The command that starts your development server",
    },
    port,
    targetPort,
    publish: {
      type: "string",
      description: "The path to your static content folder",
      pattern: file_regex(),
    },
    jwtRolePath: {
      type: "string",
      description: docs.Dev__jwtRolePath__d,
    },
    jwtSecret: {
      type: "string",
      description: "The secret used to verify tokens for JWT-based redirects.",
    },
    autoLaunch: {
      type: "boolean",
      description:
        "A boolean value that determines whether Netlify Dev launches the local server address in your browser",
    },
    framework,
    https: {
      "x-no-edit-when-empty": true,
      type: "object",
      description:
        "Specifies an SSL/TLS certificate and key file for the Netlify Dev local server. By default, Netlify Dev starts an HTTP server, but you can configure a certificate and key file if you require HTTPS",
      properties: {
        certFile: {
          type: "string",
          description: "Path to the certificate file",
        },
        keyFile: {
          type: "string",
          description: "Path to the private key file",
        },
      },
      required: ["certFile", "keyFile"],
    },
  },
  "x-taplo": {
    initKeys: ["command"],
  },
  "x-menu": ({ filePath, path, value }) => {
    return menus.menu_def2__dev.create({
      start: () => {},
      debug: () => {},
      docs: () => {
        xlib
          .vscode_()
          .env.openExternal(xlib.vscode_Uri_smartParse(docs.urls.headers))
      },
    })
  },
}))

const port = new jst.TypeW(() => ({
  type: "integer",
  description: "The port that Netlify Dev is accessible from in the browser",
  minimum: 1,
  maximum: 65535,
  "x-insert-placeholder": "8888",
}))

const targetPort = new jst.TypeW(() => ({
  type: "integer",
  description:
    "The port for your application server, framework, or site generator. If you specify values for both `command` and `targetPort`, framework must be `#custom.`",
  minimum: 1,
  maximum: 65535,
  "x-insert-placeholder": "3000",
}))

const framework = new jst.TypeW(() => {
  const items: Array<{ value: string; docs: string }> = [
    {
      value: "#auto",
      docs: "#auto: The default, tests all available detectors",
    },
    { value: "#static", docs: "#static: Specifies a static file server" },
    {
      value: "#custom",
      docs:
        "#custom: uses the command value to run an app server and the targetPort value to connect to it. Required if command and targetPort are both set.",
    },
    ...frameworks.map((x) => {
      return { value: x.id, docs: x.name }
    }),
  ]

  return {
    type: "string",
    enum: items.map((x) => x.value),
    description:
      "Setting to use if a project is detected incorrectly, flagged by multiple detectors, or requires a command and targetPort",
    "x-taplo": {
      docs: {
        enumValues: items.map((x) => x.docs),
      },
    },
  }
})

interface FrameworkInfo {
  id: string
  name: string
}

// "https://github.com/netlify/framework-info"
// load the frameworks from @netlify/framework-info
// but preval the result to JSON so we don't add @netlify/framework-info
// as a dependency unnecessarily
const frameworks = x9.preval(() => getFrameworks())

{
  frameworks
}

function getFrameworks(): FrameworkInfo[] {
  const xx = require("@netlify/framework-info/src/frameworks/main")
  return xx.FRAMEWORKS
}

/**
 * maps the framework id (from netlify/framework-info)
 * to icons in the icons2/* folder
 */
export const dev_framework_icon = {
  next: "nextjs",
  gatsby: "gatsby",
  redwoodjs: "redwood",
}
