import * as fs from "fs-extra"
import { join } from "path"
import * as peggy from "peggy"

/**
 * use macros to "embed" the .pegjs file as a string
 */
const pegjs_src = x9.preval(() =>
  fs.readFileSync(join(__dirname, "./prop_path.pegjs")).toString()
)

/**
 * use the embedded .pegjs file to generate a parser at runtime
 */
const parser = peggy.generate(pegjs_src)

/**
 * A peggy (peg.js) based parser that understands the property path format
 * used in `@netlify/config/src/validate/validations`
 * @param propPath
 * @returns
 */
export function prop_path_parser(
  propPath: string
): undefined | (string | number)[] {
  try {
    return parser.parse(propPath).flat()
  } catch (e) {}
}

{
  prop_path_parser("foo.bar.baz[8].blah")
}

{
  const ff = join(__dirname, "./prop_path.pegjs")
  const src = fs.readFileSync(ff).toString()
  const pp = peggy.generate(src)
  pp.parse("foo.bar.baz[3]")
  const pp2 = peggy.generate(src, { output: "source", format: "bare" })
  pp2
}

function generateParser(): string {
  const ff = join(__dirname, "./prop_path.pegjs")
  const src = fs.readFileSync(ff).toString()
  // const pp = peggy.generate(src)
  // pp.parse("foo.bar.baz[3]")
  const pp2 = peggy.generate(src, { output: "source", format: "bare" })
  return pp2
}

function generateParser2(): string {
  const ff = join(__dirname, "./prop_path.pegjs")
  const src = fs.readFileSync(ff).toString()
  // const pp = peggy.generate(src)
  // pp.parse("foo.bar.baz[3]")
  const pp2 = peggy.generate(src, { output: "source", format: "bare" })
  return pp2
}
