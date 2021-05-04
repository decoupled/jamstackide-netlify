import * as lsp from "vscode-languageserver-types"

export function getRange(nodes: Node[], err: Error): lsp.Range {
  let currentPath: string[] = []
  let currentPathStr: string = ""

  const arrayCache: Record<string, number> = {}

  for (const node of nodes) {
    if (node.type === "Assign") {
      currentPathStr = currentPath.join(".") + "." + node.key
    } else if (node.type === "ArrayPath") {
      if (node.value.length > 1)
        currentPath.push(node.value[node.value.length - 1])
      else currentPath = node.value
      let idx = arrayCache[currentPath.join(".")]
      if (typeof idx === "undefined") {
        idx = 0
      } else {
        idx += 1
      }
      arrayCache[currentPath.join(".")] = idx
      currentPath.push(currentPath.pop() + `[${idx}]`)
      currentPathStr = currentPath.join(".")
    } else if (node.type === "ObjectPath") {
      if (node.value.length > 1)
        currentPath.push(node.value[node.value.length - 1])
      else currentPath = node.value
      currentPathStr = currentPath.join(".")
    }
    if (currentPathStr == err.propPath) {
      if (node.type === "Assign") {
        const start: lsp.Position = {
          line: node.value.line - 1,
          character: node.value.column - 1,
        }
        const valueLength =
          typeof err.value === "string"
            ? err.value.length + 2
            : err.value.toString().length

        const end: lsp.Position = {
          line: start.line,
          character: start.character + valueLength,
        }
        return { start, end } as lsp.Range
      } else {
        const start: lsp.Position = {
          line: node.line - 1,
          character: node.column - 1,
        }
        const end: lsp.Position = {
          line: start.line,
          character: start.character + err.propPath.length + 2,
        }
        return { start, end } as lsp.Range
      }
    }
  }
}

interface AssignNode {
  type: "Assign"
  value: { type: string; value: any; line: number; column: number }
  line: number
  column: number
  key: string
}

interface ObjectPathNode {
  type: "ObjectPath"
  value: string[]
  line: number
  column: number
}

interface ArrayPathNode {
  type: "ArrayPath"
  value: string[]
  line: number
  column: number
}

type Node = AssignNode | ObjectPathNode | ArrayPathNode

interface ValueError {
  kind: "ValueError"
  message: string
  propPath: string
  value: any
}

interface RequiredError {
  kind: "RequiredError"
  message: string
  propPath: string
}

type Error = ValueError

import { parse } from "toml/lib/parser"
import { netlify_toml_example } from "./netlify_toml_example"

{
  const parsed = parse(netlify_toml_example)
  console.log(parsed)
  const range = getRange(parsed, {
    kind: "ValueError",
    propPath: "plugins[0]",
    message: "'plugins[0]' \"package\" property is required.",
    value: {},
  })
  console.log(range)
}

// export function getRange(nodes: Node[], err: Error) {
//   let currentPath: string[] = []
//   let currentPathStr: string = ""

//   const arrayCache: Record<string, number> = {}

//   for (const node of nodes) {
//     if (node.type === "Assign") {
//       currentPathStr = currentPath.join(".") + "." + node.key
//     } else if (node.type === "ArrayPath") {
//       if (node.value.length > 1)
//         currentPath.push(node.value[node.value.length - 1])
//       else currentPath = node.value
//       let idx = arrayCache[currentPath.join(".")]
//       if (typeof idx === "undefined") idx = 0
//       else idx += 1
//       arrayCache[currentPath.join(".")] = idx
//       currentPath.push(currentPath.pop() + `[${idx}]`)
//       currentPathStr = currentPath.join(".")
//     } else if (node.type === "ObjectPath") {
//       if (node.value.length > 1)
//         currentPath.push(node.value[node.value.length - 1])
//       else currentPath = node.value
//       currentPathStr = currentPath.join(".")
//     }
//     if (currentPathStr == err.propPath) {
//       if (node.type === "Assign") {
//         const start = new vscode.Position(
//           node.value.line - 1,
//           node.value.column - 1
//         )
//         const valueLength =
//           typeof err.value === "string"
//             ? err.value.length + 2
//             : err.value.toString().length
//         return new vscode.Range(start, start.translate(0, valueLength))
//       } else {
//         const start = new vscode.Position(node.line - 1, node.column - 1)
//         return new vscode.Range(
//           start,
//           start.translate(0, err.propPath.length + 2)
//         )
//       }
//     }
//   }
// }
