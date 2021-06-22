import * as xlib from "@decoupled/xlib"

export type SimpleJSONPath = (string | number)[]

type MenuInstance = ReturnType<
  InstanceType<typeof xlib.vscode_TreeItemMenu>["create"]
>

export interface Doc<DefIDs extends string = string> extends T_object {
  $id: string
  $schema: string
  title?: string
  definitions?: Record<DefIDs, TypeExpr>
}

type URLString = string

export type TypeDef = T_object | T_array | T_string | T_boolean | T_integer

export function TypeDef_is(x: TypeExpr): x is TypeDef {
  if (typeof (x as any).type === "string") return true
}

export type TypeExpr = TypeDef | Ref | OneOf

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
}

export interface T_object extends T_base<Record<string, any>> {
  type: "object"
  properties?: Record<string, TypeExpr>
  additionalProperties?: any
  required?: any
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

export interface Ref<DefIDs extends string = string> {
  $ref: `#/definitions/${DefIDs}`
}
