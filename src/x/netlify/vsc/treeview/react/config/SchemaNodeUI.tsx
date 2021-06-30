import React from "react"
import vscode from "vscode"
import { Array_unique_keep_first } from "../../../../../Array/Array_unique_keep_first"
import { None, TreeItem, TreeItemProps } from "./deps"
import { SchemaNodeUI_MenuHelper } from "./SchemaNodeUI_MenuHelper"
import { TOMLPath } from "./types"
import { label_description } from "./util"

type OverridesFromParent = Partial<Pick<TreeItemProps, "tooltip">>

export class SchemaNodeUI extends React.Component<
  {
    ctx: vscode.ExtensionContext
    schema: any
    value: any
    label?: string
    description?: string
    path: TOMLPath
    pathString: string
    onSelect?: (path: TOMLPath) => void
    onEdit?: (path: TOMLPath, schema: any) => void
    filePath: string
  } & OverridesFromParent
> {
  get menu() {
    return this.menuHelper.menu
  }
  get menuHelper() {
    return new SchemaNodeUI_MenuHelper(this.props)
  }

  private createOnSelect() {
    const onSelect = this.props.onSelect
    const pathString = this.props.pathString
    return () => {
      onSelect?.(JSON.parse(pathString))
    }
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
  get x_icon(): vscode.Uri | vscode.ThemeIcon | undefined {
    const { schema, value, ctx } = this.props
    return schema?.["x-icon"]?.({ value, ctx })
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
    let all_keys = Array.from(
      new Set([...schema_prop_keys, ...value_prop_keys])
    )
    if (schema["x-sort-keys-with-values-first"]) {
      all_keys = Array_unique_keep_first([
        ...value_prop_keys, // value keys first
        ...schema_prop_keys,
      ])
    }
    const elms: any[] = []

    for (const k of all_keys) {
      const value2 = value[k]
      const schema2 = schema.properties?.[k] ?? schema.additionalProperties
      if (!schema2) continue
      const elm = (
        <SchemaNodeUI
          ctx={this.props.ctx}
          filePath={this.props.filePath}
          key={"key:" + k}
          schema={schema2}
          value={value2}
          label={k}
          path={[...path, k]}
          pathString={JSON.stringify([...path, k])}
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
        {...label_description(
          this.isUndefined,
          label,
          description2,
          this.x_icon
        )}
        tooltip={tooltip}
        menu={this.menu}
        select={this.createOnSelect()}
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
      const label = i + ""
      const newPath = path.concat(i)
      return (
        <SchemaNodeUI
          ctx={this.props.ctx}
          filePath={this.props.filePath}
          onSelect={onSelect}
          key={"key:" + i}
          schema={schema2}
          value={value2}
          label={label}
          path={newPath}
          pathString={JSON.stringify([...path, i])}
          onEdit={onEdit}
        />
      )
    })
    return (
      <TreeItem
        {...label_description(
          this.isUndefined,
          label,
          description,
          this.x_icon
        )}
        tooltip={tooltip}
        menu={this.menu}
        select={this.createOnSelect()}
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
          iconPath={this.x_icon}
          label={""}
          description={label}
          collapsibleState={None}
          tooltip={tooltip}
          menu={this.menu}
          select={this.createOnSelect()}
        />
      )
    } else {
      return (
        <TreeItem
          iconPath={this.x_icon}
          label={"  " + label}
          description={"= " + (value + "").trim()}
          collapsibleState={None}
          tooltip={tooltip}
          menu={this.menu}
          select={this.createOnSelect()}
        />
      )
    }
  }
}
