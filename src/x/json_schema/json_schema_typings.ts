import * as xlib from "@decoupled/xlib"
import _ from "lodash"
import { Object_iterateAllReachableObjectsAndArrays } from "x/Object/Object_iterateAllReachableObjectsAndArrays"
import { removeUndefinedProps } from "x/toml/netlify_toml_schema/util"

export type SimpleJSONPath = readonly (string | number)[]

type MenuInstance = ReturnType<
  InstanceType<typeof xlib.vscode_TreeItemMenu>["create"]
>

export interface Doc extends T_object {
  $id: string
  $schema: string
  title?: string
  definitions?: Record<string, TypeExpr>
}

type URLString = string

export type TypeDef = T_object | T_array | T_string | T_boolean | T_integer

export function TypeDef_is(x: TypeExpr): x is TypeDef {
  if (typeof (x as any).type === "string") return true
}

export type TypeExpr = TypeDef | Ref | OneOf | TypeW

export type TypeExprNoRefs = TypeDef | OneOf

interface OneOf {
  oneOf: TypeExpr[]
}

interface T_base<ValueType = any> {
  title?: string
  description?: string
  /**
   * xlabel!
   */
  "x-label"?: (v: ValueType) => string | undefined
  "x-taplo"?: any
  "x-docs"?: URLString
  "x-validate"?: (v: ValueType) => Promise<any>
  "x-menu"?: (opts: {
    filePath: string
    path: SimpleJSONPath
    value?: ValueType
  }) => MenuInstance
  enum?: any
  "x-no-edit-when-empty"?: boolean
  "x-insert-placeholder"?: string
}

export interface T_object extends T_base<Record<string, any>> {
  type: "object"
  properties?: Record<string, TypeExpr>
  additionalProperties?: any
  required?: any
  "x-sort-keys-with-values-first"?: boolean
  "x-add-button"?: { label: string; handler: () => void }
}

export interface T_array extends T_base<Array<any>> {
  type: "array"
  items: TypeExpr
  uniqueItems?: boolean
  minItems?: number
}

export interface T_string extends T_base<string> {
  type: "string"
  pattern?: string
}

export interface T_integer extends T_base<number> {
  type: "integer"
  minimum?: number
  maximum?: number
}

export interface T_boolean extends T_base<boolean> {
  type: "boolean"
}

export interface Ref {
  $ref: string //`#/definitions/${DefIDs}`
}

/*
----- class based DSL
*/

abstract class BaseW {
  constructor(private readonly _x: TypeExpr | (() => TypeExpr)) {
    this.id = BaseW.serial++
  }
  readonly id: number
  @xlib.lazy() get x() {
    return force(this._x)
  }
  @xlib.lazy() get definitionName(): string {
    return `type_def_${this.id}`
  }
  @xlib.lazy() get validJSONSchema() {
    return TypeW_replaceAllWithRefs(this.x)
  }
  @xlib.lazy() get referencedTypes() {
    return new Set(TypeW_collectAllReachable(this.x))
  }
  @xlib.lazy() get referencedTypes_rec() {
    const seen = new Set<TypeW>()
    this._referencedTypes_rec(seen)
    return seen
  }
  private _referencedTypes_rec(seen = new Set<TypeW>()): void {
    for (const r of this.referencedTypes) {
      if (seen.has(r)) continue
      seen.add(r)
      r._referencedTypes_rec(seen)
    }
  }
  private static serial = 0
}

export class TypeW extends BaseW {
  constructor(_x: () => TypeExpr) {
    super(_x)
  }
}
export class DocW extends BaseW {
  constructor(_x: Doc | (() => Doc)) {
    super(_x)
  }

  @xlib.lazy() get validJSONSchema(): Doc {
    const allTypes = this.referencedTypes_rec
    const xx = TypeW_replaceAllWithRefs(this.x)
    const dd = (xx.definitions ??= {})
    for (const t of allTypes) dd[t.definitionName] = t.validJSONSchema
    return removeUndefinedProps(xx)
  }
}

function* TypeW_iterAllReachable(x: any) {
  for (const xx of Object_iterateAllReachableObjectsAndArrays(x))
    if (xx && xx instanceof TypeW) yield xx
}

function TypeW_collectAllReachable(x: any): Set<TypeW> {
  return new Set(iter())
  function* iter() {
    for (const xx of Object_iterateAllReachableObjectsAndArrays(x))
      if (xx && xx instanceof TypeW) yield xx
  }
}

function TypeW_replaceAllWithRefs(x: any): any {
  if (x instanceof TypeW) return { $ref: `#/definitions/${x.definitionName}` }
  if (Array.isArray(x)) return x.map(TypeW_replaceAllWithRefs)
  if (typeof x === "object" && x !== null)
    return _.mapValues(x, TypeW_replaceAllWithRefs)
  return x
}

function force<T>(f: T | (() => T)): T {
  if (typeof f === "function") return (f as any)()
  return f
}
