export const netlify_toml_example_as_json = {
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
