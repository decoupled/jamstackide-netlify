import * as fs from "fs-extra"
import glob from "glob"
import { Host } from "./Host"

export class DefaultHost implements Host {
  existsSync(path: string) {
    return fs.existsSync(path)
  }
  readFileSync(path: string) {
    return fs.readFileSync(path, { encoding: "utf8" }).toString()
  }
  readdirSync(path: string) {
    return fs.readdirSync(path)
  }
  globSync(pattern: string) {
    return glob.sync(pattern)
  }
  writeFileSync(path: string, contents: string) {
    return fs.writeFileSync(path, contents)
  }
}
