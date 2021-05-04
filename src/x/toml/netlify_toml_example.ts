export const netlify_toml_example = `
[build]
  command = "yarn rw db up --no-db-client && yarn rw build"
  publish = "web/dist"
  functions = 123

[dev]
  [dev.inner]
    test = "foo"
  command = "yarn rw dev"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[plugins]]
  [plugins.inputs]
    path = 'api/prisma/schema.prisma'
`
