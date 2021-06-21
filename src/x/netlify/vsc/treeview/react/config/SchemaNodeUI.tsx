import React from "react"
import vscode from "vscode"
import { None, TreeItem, TreeItemProps } from "./deps"
import { SchemaNodeUI_MenuHelper } from "./SchemaNodeUI_MenuHelper"
import { TOMLPath } from "./types"
import { label_description } from "./util"

type OverridesFromParent = Partial<Pick<TreeItemProps, "tooltip">>

export class SchemaNodeUI extends React.Component<
  {
    schema: any
    value: any
    label?: string
    description?: string
    path: TOMLPath
    onSelect?: (path: TOMLPath) => void
    onEdit?: (path: TOMLPath) => void
  } & OverridesFromParent
> {
  get menu() {
    return this.menuHelper.menu
  }
  get menuHelper() {
    return new SchemaNodeUI_MenuHelper(this.props)
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
