import { readFileSync } from "fs"
import * as toml from "toml"
import { join } from "path"
{
  const tt = join(__dirname, "/sample_file.toml")
  const netlify_toml = join(__dirname, "/netlify_toml_example.toml")
  const result = toml.parse(readFileSync(netlify_toml).toString())
  result
}

const obj = {
  title: "TOML Example",
  owner: {
    name: "Tom Preston-Werner",
    dob: "1979-05-27T15:32:00.000Z",
  },
  database: {
    server: "192.168.1.1",
    ports: [8000, 8001, 8002],
    connection_max: 5000,
    enabled: true,
  },
  servers: {
    alpha: {
      ip: "10.0.0.1",
      dc: "eqdc10",
    },
    beta: {
      ip: "10.0.0.2",
      dc: "eqdc10",
    },
  },
  clients: {
    data: [
      ["gamma", "delta"],
      [1, 2],
    ],
    hosts: ["alpha", "omega"],
  },
}

const netlify_toml_parsed = {
  build: {
    base: "project/",
    publish: "build-output/",
    command: "echo 'default context'",
  },
  plugins: [
    {
      package: "@netlify/plugin-lighthouse",
    },
  ],
  context: {
    production: {
      publish: "output/",
      command: "make publish",
      environment: {
        ACCESS_TOKEN: "super secret",
        NODE_VERSION: "14.15.3",
      },
    },
    "deploy-preview": {
      publish: "dist/",
      environment: {
        ACCESS_TOKEN: "not so secret",
      },
    },
    "branch-deploy": {
      command: "echo branch",
      environment: {
        NODE_ENV: "development",
      },
    },
    staging: {
      command: "echo 'staging'",
      base: "staging",
    },
    "feat/branch": {
      command: "echo 'special branch'",
      base: "branch",
    },
  },
  redirects: [
    {
      from: "/*",
      to: "/blog/:splat",
    },
    {
      from: "/old-path",
      to: "/new-path",
      status: 302,
      force: true,
      query: {
        id: ":id",
      },
      conditions: {
        Language: ["en"],
        Country: ["US"],
      },
      signed: "API_SIGNATURE_TOKEN",
      headers: {
        "X-From": "Netlify",
        "X-Api-Key": "some-api-key-string",
      },
    },
    {
      from: "/gated-path",
      status: 200,
      conditions: {
        Role: ["admin"],
      },
      force: true,
    },
    {
      from: "/*",
      to: "/index.html",
      status: 200,
    },
  ],
  headers: [
    {
      for: "/*",
      values: {
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Content-Security-Policy": "frame-ancestors https://www.facebook.com",
        "cache-control":
          "\tmax-age=0,\n\tno-cache,\n\tno-store,\n\tmust-revalidate",
        "Basic-Auth": "someuser:somepassword anotheruser:anotherpassword",
      },
    },
  ],
  functions: {
    directory: "functions/",
  },
}
