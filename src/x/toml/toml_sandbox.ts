import { readFileSync } from "fs"
import * as toml from "toml"
import { join } from "path"
{
  const netlify_toml = join(__dirname, "example3_netlify.toml")
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
