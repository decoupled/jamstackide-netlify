import { outputFileSync, readJSONSync } from "fs-extra"
import hsc from "http-status-codes"
import _ from "lodash"
import { join } from "path"
import { iso3166_countries_jsonSchema } from "x/iso3166/iso3166"

const Ajv = require("ajv")

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
  const schema = {
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
      },
      context: $ref("ContextMap"),
      headers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            for: { type: "string" },
            values: $ref("HeaderMap"),
          },
          required: ["for", "values"],
        },
      },
      functions: $ref("Functions"),
      dev: $ref("Dev"),
    },
    definitions: {
      Functions: {
        type: "object",
        description: `Configuration for Netlify Functions. [Docs](https://docs.netlify.com/configure-builds/file-based-configuration/#functions)`,
        properties: {
          directory: {
            type: "string",
            description: "Sets a custom directory for Netlify Functions",
            pattern: file_regex(),
          },
          node_bundler: {
            type: "string",
            enum: ["esbuild", "zisi"],
            description: "The function bundling method used",
            "x-taplo": {
              docs: {
                enumValues: ["ESBuild", "Zip it and Shipt It!"],
              },
            },
          },
          external_node_modules: $ref("Functions__external_node_modules"),
          included_files: $ref("Functions__included_files"),
        },
        additionalProperties: $ref("FunctionOverrides"),
      },
      FunctionOverrides: {
        type: "object",
        properties: {
          external_node_modules: $ref("Functions__external_node_modules"),
          included_files: $ref("Functions__included_files"),
        },
      },
      Functions__external_node_modules: {
        description: Functions__external_node_modules__d,
        type: "array",
        items: { type: "string" },
      },
      Functions__included_files: {
        description: Functions__included_files__d,
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
      },
      ContextMap: {
        type: "object",
        additionalProperties: $ref("Context"),
      },
      Context: {
        type: "object",
        properties: {
          base: {
            type: "string",
            description: build_base_description,
          },
          publish: {
            type: "string",
            description: build_publish_description,
          },
          command: { type: "string", description: build_command_description },
          environment: $ref("Env"),
          plugins: $ref("Plugins"),
          processing: $ref("Processing"),
        },
      },
      Build: {
        type: "object",
        description: build_description,
        properties: {
          base: {
            type: "string",
            description: build_base_description,
          },
          publish: {
            type: "string",
            description: build_publish_description,
          },
          command: { type: "string", description: build_command_description },
          environment: $ref("Env"),
          processing: $ref("Processing"),
          edge_handlers: {
            type: "string",
            description: `Custom path to your Edge Handlers directory`,
          },
          ignore: {
            type: "string",
            description:
              "Bash command that will be run from the base directory to determine whether the site needs rebuilding or not",
          },
        },
        // required: ["command"],
      },
      Plugins: {
        type: "array",
        items: $ref("Plugin"),
        description: "Build Plugins",
      },
      Plugin: {
        type: "object",
        description: `[Docs](https://docs.netlify.com/configure-builds/build-plugins/#configure-settings)`,
        properties: {
          package: { type: "string", description: Plugin_package_description },
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
      },
      Dev: {
        type: "object",
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
            description:
              "The object path that points to role values for JWT-based redirects.",
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

      Condition_Country: iso3166_countries_jsonSchema("Country"),
    },
  }
  return removeUndefinedProps(schema)

  function conditionArr(description?: string) {
    return {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
      minItems: 1,
      description,
    }
  }
  function Redirect_(roleBased?: boolean) {
    return {
      type: "object",
      title: "Redirect" + (roleBased ? " (Role Based)" : ""),
      properties: {
        from: { type: "string" },
        to: roleBased ? undefined : { type: "string" },
        status: {
          type: "integer",
          description:
            "The default HTTP status code is 301, but you can define a different one",
        },
        force: { type: "boolean", description: Redirect_force_description },
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

  function $ref(x: string) {
    return { $ref: `#/definitions/${x}` }
  }
}

const build_base_description = `
Directory to change to before starting a build.
This is where we will look for package.json/.nvmrc/etc.
If not set, defaults to the root directory.`.trim()

const build_publish_description = `
Directory that contains the deploy-ready HTML files and assets generated by
the build. This is relative to the base directory if one has been set, or the
root directory if a base has not been set. This sample publishes the
directory located at the absolute path "root/project/build-output"
`.trim()

const build_command_description = `Default build command`

const build_description = `
Settings in the [build] context are global and are applied to all contexts
unless otherwise overridden by more specific contexts.`.trim()

const Redirect_force_description = `By default, redirects won’t be applied if there’s a file with the same
path as the one defined in the "from" property. Setting "force" to "true"
will make the redirect rule take precedence over any existing files.`.trim()

const Plugin_package_description = `
* For a plugin installed from npm, the npm package name of the plugin.
* For a local plugin, the path to a directory containing the plugin’s index.js and manifest.yml files. The package value for a local plugin must start with . or /.
`.trim()

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

{
  removeUndefinedProps({ x: { a: "a", b: undefined } })
}

const Functions__external_node_modules__d = `
A list of Node.js modules that are copied to the bundled artifact
without adjusting their source or references during the bundling process;
only applies when \`node_bundler\` is set to \`esbuild\`.
This property helps handle dependencies that can’t be inlined,
such as modules with native add-ons.`.trim()

const Functions__included_files__d = `
A list of additional paths to include in the function bundle.
Although our build system includes statically referenced files (like \`require("./some-file.js")\`) by default,
included_files lets you specify additional files or directories and reference them dynamically in function code.
You can use \`*\` to match any character or prefix an entry with \`!\` to exclude files.
Paths are relative to the [base directory](https://docs.netlify.com/configure-builds/get-started/#definitions-1).
`

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

function* httpStatusCodes() {
  for (const k of Object.keys(hsc)) {
    const code = hsc[k]
    if (typeof code !== "number") continue
    yield {
      k,
      code,
      reason: hsc.getStatusText(200),
    }
  }
}

function httpStatusCodesJSONSchema() {}

function port(description?: string) {
  return {
    type: "integer",
    description,
    minimum: 1,
    maximum: 65535,
  }
}
