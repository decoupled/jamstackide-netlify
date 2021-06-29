import * as xlib from "@decoupled/xlib"
import Ajv from "ajv"
import { outputFileSync, readJSONSync } from "fs-extra"
import hsc from "http-status-codes"
import _ from "lodash"
import { join } from "path"
import { create_function_cmd } from "src/vscode_extension/commands/CreateFunctionCommand"
import {
  add_custom_header_cmd,
  add_redirect_cmd,
} from "src/vscode_extension/commands/RightClickCommands"
import { iso3166_countries_jsonSchema } from "x/iso3166/iso3166"
import * as jst from "x/json_schema/json_schema_typings"
import * as menus from "x/netlify/vsc/treeview/react/config/menus"
import * as docs from "./netlify_toml_docs"

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

export function netlify_toml_json_schema_generate() {
  const schema: jst.Doc = {
    $id: "https://netlify.com/netlif.toml.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "Netlify Configuration File",
    type: "object",
    properties: {
      build: $ref("Build"),
      plugins: $ref("Plugins"),
      redirects: {
        type: "array",
        items: $ref("Redirect"),
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
      },
      context: $ref("ContextMap"),
      headers: {
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
            values: $ref("HeaderMap"),
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
      },
      functions: $ref("Functions"),
      dev: $ref("Dev"),
    },
    definitions: {
      Functions: {
        type: "object",
        description: `Configuration for Netlify Functions. [Docs](https://docs.netlify.com/configure-builds/file-based-configuration/#functions)`,
        "x-docs":
          "https://docs.netlify.com/configure-builds/file-based-configuration/#functions",
        properties: {
          directory: {
            type: "string",
            description: "Sets a custom directory for Netlify Functions",
            pattern: file_regex(),
          },
          node_bundler: node_bundler(),
          external_node_modules: $ref("Functions__external_node_modules"),
          included_files: $ref("Functions__included_files"),
        },
        additionalProperties: $ref("FunctionOverrides"),
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
      },
      FunctionOverrides: {
        type: "object",
        properties: {
          external_node_modules: $ref("Functions__external_node_modules"),
          included_files: $ref("Functions__included_files"),
        },
      },
      Functions__external_node_modules: {
        description: docs.Functions__external_node_modules__d,
        type: "array",
        items: { type: "string" },
      },
      Functions__included_files: {
        description: docs.Functions__included_files__d,
        type: "array",
        items: { type: "string" },
      },
      Redirect: Redirect_(),
      Redirect_old: {
        oneOf: [$ref("Redirect_Simple"), $ref("Redirect_RoleBased")],
      },
      Redirect_Simple: Redirect_(),
      Redirect_RoleBased: Redirect_(true),
      Env: {
        description: "Environment Variables",
        type: "object",
        additionalProperties: { type: "string" },
      },
      HeaderMap: {
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
      },
      ContextMap: {
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
          // production: $ref("Context"),
          // "deploy-preview": $ref("Context"),
          // "branch-deploy": $ref("Context"),
          // we created the Context_() helper function just so we could pass different descriptions
          production: Context_(
            "This context corresponds to the main site’s deployment, attached to the Git branch you set when the site is created"
          ),
          "deploy-preview": Context_(
            "This context corresponds to the previews we build for pull/merge requests."
          ),
          "branch-deploy": Context_(
            "This context corresponds to deploys from branches that are not the site’s main production branch."
          ),
        },
        additionalProperties: $ref("Context"),
      },
      Context: {
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
          environment: $ref("Env"),
          plugins: $ref("Plugins"),
          processing: $ref("Processing"),
        },
      },
      Build: {
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
          },
          command: {
            type: "string",
            description: docs.build_command_description,
          },
          environment: $ref("Env"),
          processing: $ref("Processing"),
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
      },
      Plugins: {
        type: "array",
        items: $ref("Plugin"),
        description: "Build Plugins",
        "x-docs":
          "https://docs.netlify.com/configure-builds/file-based-configuration/#build-plugins",
        title: "Plugins",
      },
      Plugin: {
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
          inputs: $ref("PluginInputs"),
        },
        required: ["package"],
      },
      PluginInputs: {
        description: "Custom Settings for Plugin",
        type: "object",
        additionalProperties: { type: "string" },
      },
      Processing: {
        type: "object",
        "x-docs":
          "https://docs.netlify.com/configure-builds/file-based-configuration/#post-processing",
        properties: {
          skip_processing: { type: "boolean" },
          css: {
            type: "object",
            properties: {
              bundle: { type: "boolean" },
              minify: { type: "boolean" },
            },
            "x-taplo": { initKeys: ["bundle", "minify"] },
          },
          js: {
            type: "object",
            properties: {
              bundle: { type: "boolean" },
              minify: { type: "boolean" },
            },
            "x-taplo": { initKeys: ["bundle", "minify"] },
          },
          html: {
            type: "object",
            properties: {
              pretty_urls: { type: "boolean" },
            },
            "x-taplo": { initKeys: ["pretty_urls"] },
          },
          images: {
            type: "object",
            properties: {
              compress: { type: "boolean" },
            },
            "x-taplo": { initKeys: ["compress"] },
          },
        },
        "x-no-edit-when-empty": true,
      },
      Dev: {
        type: "object",
        "x-no-edit-when-empty": true,
        description: "Configuration for Netlify Dev",
        "x-docs":
          "https://docs.netlify.com/configure-builds/file-based-configuration/#netlify-dev",
        properties: {
          command: {
            type: "string",
            description: "The command that starts your development server",
          },
          port: port(
            "The port that Netlify Dev is accessible from in the browser"
          ),
          targetPort: port(
            "The port for your application server, framework, or site generator. If you specify values for both `command` and `targetPort`, framework must be `#custom.`"
          ),
          publish: {
            type: "string",
            description: "The path to your static content folder",
          },
          jwtRolePath: {
            type: "string",
            description: docs.Dev__jwtRolePath__d,
          },
          jwtSecret: {
            type: "string",
            description:
              "The secret used to verify tokens for JWT-based redirects.",
          },
          autoLaunch: {
            type: "boolean",
            description:
              "A boolean value that determines whether Netlify Dev launches the local server address in your browser",
          },
          framework: {
            type: "string",
            description:
              "Setting to use if a project is detected incorrectly, flagged by multiple detectors, or requires a command and targetPort",
          },
          https: {
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
      },
      Condition_Country: iso3166_countries_jsonSchema("Country", "both"),
    },
  }
  return removeUndefinedProps(schema)

  function Context_(description?: string): jst.T_object {
    return {
      type: "object",
      description,
      "x-no-edit-when-empty": true,
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
        environment: $ref("Env"),
        plugins: $ref("Plugins"),
        processing: $ref("Processing"),
      },
    }
  }

  function conditionArr(description?: string): jst.T_array {
    return {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
      minItems: 1,
      description,
    }
  }
  function Redirect_(roleBased?: boolean): jst.T_object {
    return {
      type: "object",
      title: "Redirect",
      "x-label": (v: any) => {
        if (typeof v !== "object") return
        if (v === null) return
        const parts: string[] = []
        parts.push(v.from)
        if (v.to) {
          parts.push("-->")
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
            Country: $ref("Condition_Country"),
            Role: conditionArr(),
          },
          required: roleBased ? ["Role"] : [],
        },
        signed: {
          type: "string",
          description:
            "Sign each request with a value defined in an environment variable",
        },
        headers: $ref("HeaderMap"),
        edge_handler: { type: "string" },
      },
      required: ["from"],
      // required: roleBased ? ["from", "conditions"] : ["from", "to"],
      additionalProperties: false,
      "x-taplo": { initKeys: ["from", "to"] },
    }
  }

  function $ref(x: string): jst.Ref {
    return { $ref: `#/definitions/${x}` }
  }
}

function removeUndefinedProps(x: any) {
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

function file_regex() {
  return `
^
  (
    (  / | [\\w-] | \\.  )+
  )+
$`.replace(/\s+/g, "")
}

{
  const cc = Array.from(httpStatusCodes())
  _.sortBy(cc, "code")
}

function httpStatusCodes() {
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

function httpStatusCodesJSONSchema() {}

function port(description?: string): jst.T_integer {
  return {
    type: "integer",
    description,
    minimum: 1,
    maximum: 65535,
  }
}

function node_bundler(): jst.T_string {
  return {
    type: "string",
    enum: ["esbuild", "zisi"],
    description: "The function bundling method used",
    "x-taplo": {
      docs: {
        enumValues: [docs.esbuild, docs.zisi],
      },
    },
  }
}

// function executeCommand(id: string, ...args: any[]) {
//   xlib.vscode_().commands.executeCommand(id, ...args)
// }
