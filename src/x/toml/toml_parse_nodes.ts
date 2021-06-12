import { readFileSync } from "fs"
import { join } from "path"
import {
  toml_parse,
  TopLevelNode,
  TOMLNode,
  ObjectPath,
  ArrayPath,
  Assign,
  Value,
} from "./toml_parse"
{
  const netlify_toml = join(__dirname, "example1_netlify.toml")
  const result = toml_parse(readFileSync(netlify_toml).toString())
  result
  toml_parse_find_node(
    ["context", "deploy-preview", "environment", "ACCESS_TOKEN"],
    result
  )
  toml_parse_find_node_or_ancestor_2
  // findNode(["build", "project"], result)
}

type Path = (string | number)[]

export class TOMLHelper {
  private nodes: TopLevelNode[]
  constructor(x: string | TopLevelNode[]) {
    this.nodes = typeof x === "string" ? toml_parse(x) : x
  }
  findByPath(path: Path): TOMLNode | undefined {
    return toml_parse_find_node(path, this.nodes)
  }
  findClosestAncestorByPath(
    path: Path
  ): { ancestor: TOMLNode; ancestorPath: Path } | undefined {
    path = [...path] // clone
    while (true) {
      if (path.length === 0) break
      const x = this.findByPath(path)
      if (x) return { ancestor: x, ancestorPath: path }
      path.pop()
    }
  }
  getTopLevelSections() {
    type Section = { node?: ObjectPath | ArrayPath; assigns: Assign[] }
    const sections: Section[] = [{ assigns: [] }]
    for (const n of this.nodes) {
      if (n.type === "ObjectPath" || n.type === "ArrayPath") {
        sections.push({ node: n, assigns: [] })
      } else {
        sections[sections.length - 1].assigns.push(n)
      }
    }
    return sections
  }
  getLastNodeInSection(
    n: ObjectPath | ArrayPath
  ): ObjectPath | ArrayPath | Assign {
    for (const { node, assigns } of this.getTopLevelSections()) {
      if (node === n) {
        if (assigns.length === 0) return node
        return assigns[assigns.length - 1]
      }
    }
    throw new Error(
      "section not found. this is not possible unless you passed in TOMLNode created by another parser"
    )
  }
}

export function toml_parse_find_node_or_ancestor_2(
  path: Path,
  src: string
): { ancestor: TOMLNode; ancestorPath: Path } | undefined {
  const parsed = toml_parse(src)
  path = [...path] // clone
  while (true) {
    if (path.length === 0) break
    const x = toml_parse_find_node(path, parsed)
    if (x) return { ancestor: x, ancestorPath: path }

    path.pop()
  }
}

export function toml_parse_find_node_2(
  path: Path,
  src: string
): TOMLNode | undefined {
  return toml_parse_find_node(path, toml_parse(src))
}
export function toml_parse_find_node(
  path: Path,
  nodes: TopLevelNode[]
): TOMLNode | undefined {
  try {
    findNode2()
  } catch (e) {
    if (Array.isArray(e)) return e[0]
    throw e
  }
  function findNode2() {
    let currentPath: Path = []
    for (const node of nodes) {
      if (node.type === "ObjectPath") {
        currentPath = node.value
        if (pathEquals(path, node.value)) throw [node]
      } else if (node.type === "ArrayPath") {
        currentPath = node.value
        if (pathEquals(path, node.value)) throw [node]
      } else if (node.type === "Assign") {
        iterRec(node.value, [...currentPath, node.key])
      }
    }
    function iterRec(x: Value, p: Path) {
      if (pathEquals(p, path)) throw [x] // trampoline
      if (x.type === "Array") {
        x.value.forEach((xx, i) => iterRec(xx, [...p, i]))
      } else if (x.type === "InlineTable") {
        x.value.forEach((v) => iterRec(v.value, [...p, v.key]))
      }
    }
  }
}

function pathEquals(p1: Path, p2: Path): boolean {
  return p1.join(".") === p2.join(".")
}
