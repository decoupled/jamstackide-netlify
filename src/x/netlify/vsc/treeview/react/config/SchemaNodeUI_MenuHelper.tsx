import { create_function_cmd } from "src/vscode_extension/commands/CreateFunctionCommand"
import * as jst from "x/json_schema/json_schema_typings"
import {
  menu_def2__add,
  menu_def2__add__docs,
  menu_def2__docs,
  menu_def2__edit,
  menu_def2__edit__docs,
  menu_def2__functions,
} from "./menus"
import { TOMLPath } from "./types"
import { openDocs } from "./util"

export class SchemaNodeUI_MenuHelper {
  constructor(
    private props: {
      schema: jst.TypeExprNoRefs
      value: any
      filePath: string
      onEdit?: (path: TOMLPath) => void
      path: TOMLPath
    }
  ) {}

  get __menu_def2__functions() {
    return menu_def2__functions.create({
      docs: () => {},
      debug: () => {},
      debug2: () => {},
      add: () => {},
      add2: () => {},
      create_new_function: () => {
        create_function_cmd.execute()
      },
    })
  }

  get __menu_add() {
    return menu_def2__add.create({
      add: () => {},
    })
  }

  get __menu_def__add__docs() {
    return menu_def2__add__docs.create({
      add: () => {},
      docs: () => {
        this.openDocs()
      },
    })
  }

  get __menu_def__docs() {
    return menu_def2__docs.create({
      docs: () => {
        this.openDocs()
      },
    })
  }

  private openDocs() {
    const docs = this.props.schema["x-docs"]
    if (typeof docs === "string") openDocs(docs)
  }
  get __menu_def__edit__docs() {
    return menu_def2__edit__docs.create({
      edit: () => {
        this.props.onEdit?.(this.props.path)
      },
      docs: () => {
        this.openDocs()
      },
    })
  }

  get __menu_edit() {
    return menu_def2__edit.create({
      edit: () => {
        this.props.onEdit?.(this.props.path)
      },
    })
  }

  get menu__is__add(): boolean {
    const schema = this.props.schema as any
    if (schema.type === "array") return true
    if (schema.additionalProperties) return true
    return false
  }
  get menu__is__edit(): boolean {
    const schema = this.props.schema as any
    const { value } = this.props
    if (schema.type === "array") {
      return false
    } else if (schema.type === "object") {
      if (typeof value === "undefined") {
        return true
      }
      return false
    } else {
      return true
    }
  }
  get menu__is__docs(): boolean {
    const { schema } = this.props
    return !!schema["x-docs"]
  }
  get pathStr() {
    return this.props.path.join(".")
  }
  get lastPath() {
    return this.props.path.pop()
  }
  get x_menu() {
    const s = this.props.schema
    if (jst.TypeDef_is(s))
      return s["x-menu"]?.({
        filePath: this.props.filePath,
        value: this.props.value as any,
        path: this.props.path,
      })
  }
  get menu() {
    // does the schema have a predefined x-menu?
    const x_menu = this.x_menu
    if (x_menu) return x_menu

    if (this.pathStr === "functions") {
      return this.__menu_def2__functions
    }
    if (this.lastPath === "edge_handlers") {
    }

    if (this.menu__is__add && this.menu__is__docs)
      return this.__menu_def__add__docs
    if (this.menu__is__edit && this.menu__is__docs)
      return this.__menu_def__edit__docs
    if (this.menu__is__edit) return this.__menu_edit
    if (this.menu__is__add) return this.__menu_add
    if (this.menu__is__docs) return this.__menu_def__docs
    return undefined
  }
}
