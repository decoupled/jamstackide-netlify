import { lazy } from "@decoupled/xlib"
import React from "react"
import vscode from "vscode"
import { menu, None, TreeItem, TreeItemProps } from "../deps"
import {
  menu_def_add,
  menu_def_edit,
  menu_def__add__docs,
  menu_def__docs,
  menu_def__edit__docs,
} from "../menus"
import { label_description, openDocs } from "./util"

/*
add these as issues:
- show hint/description when value is not set
*/

type OverridesFromParent = Partial<Pick<TreeItemProps, "tooltip">>
export class SchemaNodeUI extends React.Component<
  {
    schema: any
    value: any
    label?: string
    description?: string
    path: (string | number)[]
    onSelect?: (path: (string | number)[]) => void
    onEdit?: (path: (string | number)[]) => void
  } & OverridesFromParent
> {
  @lazy() get __menu_add() {
    return menu(menu_def_add, {
      add: () => {
        if (this.props.schema.title === "Plugins") {
        } else {
          vscode.window.showInformationMessage("add!")
        }
      },
    })
  }

  @lazy() get __menu_def__add__docs() {
    return menu(menu_def__add__docs, {
      add: () => {
        if (this.props.schema.title === "Plugins") {
        } else {
          vscode.window.showInformationMessage("add!")
        }
      },
      docs: () => {
        this.openDocs()
      },
    })
  }

  @lazy() get __menu_def__docs() {
    return menu(menu_def__docs, {
      docs: () => {
        this.openDocs()
      },
    })
  }

  private openDocs() {
    const docs = this.props.schema["x-docs"]
    if (typeof docs === "string") openDocs(docs)
  }

  @lazy() get __menu_def__edit__docs() {
    return menu(menu_def__edit__docs, {
      edit: () => {
        this.props.onEdit?.(this.props.path)
      },
      docs: () => {
        this.openDocs()
      },
    })
  }

  @lazy() get __menu_edit() {
    return menu(menu_def_edit, {
      edit: () => {
        this.props.onEdit?.(this.props.path)
      },
    })
  }
  private __onSelect = () => {
    this.props.onSelect?.(this.props.path)
  }
  get isUndefined(): boolean {
    const { value } = this.props
    if (typeof value === "undefined") return true
    return false
  }
  get x_label(): string | undefined {
    const { schema, value } = this.props
    const f = schema?.["x-label"]
    if (typeof f === "function") return f(value)
  }
  get isRoot(): boolean {
    return this.props.path.length === 0
  }
  get menu__is__add(): boolean {
    const { schema } = this.props
    if (schema.type === "array") return true
    if (schema.additionalProperties) return true
    return false
  }
  get menu__is__edit(): boolean {
    const { schema, value } = this.props
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
  get menu() {
    if (this.menu__is__add && this.menu__is__docs)
      return this.__menu_def__add__docs
    if (this.menu__is__edit && this.menu__is__docs)
      return this.__menu_def__edit__docs
    if (this.menu__is__edit) return this.__menu_edit
    if (this.menu__is__add) return this.__menu_add
    if (this.menu__is__docs) return this.__menu_def__docs
    return undefined
  }
  render_object(): React.ReactNode {
    const {
      schema,
      value: value_original,
      label,
      description,
      tooltip,
      path,
      onEdit,
      onSelect,
    } = this.props
    const value = value_original ?? {}
    const schema_prop_keys = Object.keys(schema.properties ?? {})
    const value_prop_keys = Object.keys(value ?? {})
    const all_keys = new Set([...schema_prop_keys, ...value_prop_keys])
    const elms: any[] = []

    for (const k of all_keys) {
      const value2 = value[k]
      const schema2 = schema.properties?.[k] ?? schema.additionalProperties
      if (!schema2) continue
      const elm = (
        <SchemaNodeUI
          key={"key:" + k}
          schema={schema2}
          value={value2}
          label={k}
          path={[...path, k]}
          onSelect={onSelect}
          onEdit={onEdit}
          tooltip={
            schema2.description
              ? new vscode.MarkdownString(schema2.description, true)
              : undefined
          }
        />
      )
      elms.push(elm)
    }

    if (path.length === 0) return <>{elms}</>
    const description2 = this.x_label ?? description
    return (
      <TreeItem
        {...label_description(this.isUndefined, label, description2)}
        tooltip={tooltip}
        menu={this.menu}
        select={this.__onSelect}
      >
        {elms}
      </TreeItem>
    )
  }
  render_array(): React.ReactNode {
    const {
      schema,
      value: value_original,
      label,
      description,
      tooltip,
      path,
      onSelect,
      onEdit,
    } = this.props
    const value: any[] = Array.isArray(value_original) ? value_original : []
    const schema2 = schema.items
    const elms = value.map((value2, i) => {
      return (
        <SchemaNodeUI
          onSelect={onSelect}
          key={i}
          schema={schema2}
          value={value2}
          label={"" + i}
          path={[...path, i]}
          onEdit={onEdit}
        />
      )
    })
    return (
      <TreeItem
        {...label_description(this.isUndefined, label, description)}
        tooltip={tooltip}
        menu={this.menu}
        select={this.__onSelect}
      >
        {elms}
      </TreeItem>
    )
  }
  render(): React.ReactNode {
    const { schema, value, label, tooltip } = this.props
    if (schema.type === "object") {
      return this.render_object()
    }
    if (schema.type === "array") {
      return this.render_array()
    }
    if (typeof value === "undefined") {
      return (
        <TreeItem
          label={""}
          description={label}
          collapsibleState={None}
          tooltip={tooltip}
          menu={this.menu}
          select={this.__onSelect}
        />
      )
    } else {
      return (
        <TreeItem
          label={"  " + label}
          description={"= " + (value + "").trim()}
          collapsibleState={None}
          tooltip={tooltip}
          menu={this.menu}
          select={this.__onSelect}
        />
      )
    }
  }
}
