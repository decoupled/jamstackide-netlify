import * as toml from "./toml_parse"

const x = `
[a.b]
c="c"
`

{
  const nodes = toml.toml_parse(x)
  const data = buildData(nodes)
  console.log(data)
}

function buildData(nodes: toml.TopLevelNode[]): Obj {
  const root: Obj = { type: "Obj", entries: [], createdBy: [] }
  let focused: Obj = root
  for (const node of nodes) {
    if (node.type === "ObjectPath" || node.type === "ArrayPath") {
      applyPath(node)
    } else if (node.type === "Assign") {
      const v = node.value
      if (!toml.ScalarValue_is(v)) throw new Error("TODO")
      focused.entries.push({
        type: "ObjEntry",
        createdBy: [node],
        key: node.key,
        value: v,
      })
    }
  }
  return root

  // function processValue(value: toml.Value){
  //   const createdBy = []
  //   if (value.type === 'Array'){
  //     const arr: Arr = {type:'Arr', createdBy}
  //   }
  // }

  function applyPath(node: toml.ArrayPath | toml.ObjectPath) {
    let currObj: Obj = root
    for (const [i, key] of node.value.entries()) {
      const isLastStep = i === node.value.length - 1
      function create(): Obj {
        const createdBy: CreationReason[] = [
          { type: "PathStep", path: node, index: i },
        ]
        const objToReturn: Obj = {
          type: "Obj",
          entries: [],
          createdBy,
        }
        let objToAddToEntry: Obj | Arr = objToReturn
        if (isLastStep && node.type === "ArrayPath") {
          objToAddToEntry = {
            type: "Arr",
            entries: [{ type: "ArrEntry", value: objToReturn }],
            createdBy,
          } as Arr
        }
        return objToReturn
      }
      let entry = currObj.entries.find((x) => x.key === key)
      if (!entry) {
        entry = {
          type: "ObjEntry",
          key,
          value: create(),
          createdBy: [{ type: "PathStep", path: node, index: i }],
        }
        currObj.entries.push(entry)
      }
      let v = entry.value
      if (v.type === "Arr") {
        // access last element of the array
        v = v.entries[v.entries.length - 1]!.value
      }
      if (v.type !== "Obj") throw new Error("should not happen")
      currObj = v
    }
    focused = currObj
  }
}

type Val = Obj | Arr | toml.ScalarValue

interface PathStep {
  type: "PathStep"
  path: toml.ObjectPath | toml.ArrayPath
  index: number
}

type CreationReason = PathStep | toml.Assign

interface Obj {
  type: "Obj"
  entries: ObjEntry[]
  createdBy: CreationReason[]
}
interface ObjEntry {
  type: "ObjEntry"
  key: string
  value: Val
  createdBy: CreationReason[]
}
interface Arr {
  type: "Arr"
  entries: ArrEntry[]
  createdBy: CreationReason[]
}
interface ArrEntry {
  type: "ArrEntry"
  value: Val
  createdBy: CreationReason[]
}

const nn = [
  {
    type: "ObjectPath",
    value: ["a", "b"],
    line: 2,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "c",
      line: 3,
      column: 3,
    },
    line: 3,
    column: 1,
    key: "c",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "Integer",
          value: 1,
          line: 4,
          column: 6,
        },
        {
          type: "Array",
          value: [
            {
              type: "Integer",
              value: 2,
              line: 4,
              column: 10,
            },
            {
              type: "Integer",
              value: 4,
              line: 4,
              column: 13,
            },
          ],
          line: 4,
          column: 9,
        },
      ],
      line: 4,
      column: 5,
    },
    line: 4,
    column: 1,
    key: "d",
  },
]
