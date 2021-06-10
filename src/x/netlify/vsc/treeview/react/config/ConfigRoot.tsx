import React, { ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { lazy, memo } from "x/decorators"
import { json_schema_resolve_refs } from "x/json_schema/json_schema_resolve_refs"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_json_schema_generator"
import {
  Expanded,
  icon,
  menu,
  observer,
  TreeItem,
  TreeItemProps,
  Collapsed,
  None,
} from "../deps"
import { menu_def_add } from "../menus"

const flatSchema = json_schema_resolve_refs(netlify_toml_json_schema_generate())

function from_json_schema(getValue: (path: any[]) => any) {
  return iter(flatSchema)
  function iter(type1: any, path1: any[] = []): any {
    if (type1.type === "object") {
      const ks = Object.keys(type1.properties)
      ks.map((k) => {
        const path2 = [...path1, k]
        const type2 = type1.properties[k]
        const description = type2.description
        if (type2.type === "array") {
          let values2 = getValue(path2)
          if (!Array.isArray(values2)) values2 = []
          const itemsType = type2.items
          const vv = values2.map((_, i) => iter(itemsType, [...path1, i]))
          return (
            <Group label={k} description={description} onAdd={() => {}}>
              {vv}
            </Group>
          )
        }
      })
    } else if (type1.type === "array") {
      return <TreeItem></TreeItem>
    }
  }
}

type OverridesFromParent = Partial<
  Pick<TreeItemProps, "label" | "description" | "tooltip">
>
export class SchemaNodeUI extends React.Component<
  { schema: any; value: any; isRoot?: boolean } & OverridesFromParent
> {
  render_object(): React.ReactNode {
    const {
      schema,
      value: value_original,
      isRoot,
      label,
      description,
      tooltip,
    } = this.props
    const value = value_original ?? {}
    const schema_prop_keys = Object.keys(schema.properties ?? {})
    const value_prop_keys = Object.keys(value ?? {})
    const all_keys = new Set([...schema_prop_keys, ...value_prop_keys])
    const elms: any[] = []
    for (const k of all_keys) {
      const value2 = value[k]
      const schema2 = schema.properties[k] ?? schema.additionalProperties
      if (!schema2) continue
      const elm = (
        <SchemaNodeUI
          key={k}
          schema={schema2}
          value={value2}
          label={k}
          tooltip={schema2.description}
        />
      )
      elms.push(elm)
    }
    const canHaveAdditional = !!schema.additionalProperties
    if (isRoot) return <>{elms}</>
    return (
      <TreeItem label={label} description={description} tooltip={tooltip}>
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
    } = this.props
    const value: any[] = Array.isArray(value_original) ? value_original : []
    const schema2 = schema.items
    const elms = value.map((value2, i) => {
      return (
        <SchemaNodeUI key={i} schema={schema2} value={value2} label={"" + i} />
      )
    })
    return (
      <TreeItem label={label} description={description} tooltip={tooltip}>
        {elms}
      </TreeItem>
    )
  }
  render(): React.ReactNode {
    const { schema, value, label } = this.props
    if (schema.type === "object") {
      return this.render_object()
    }
    if (schema.type === "array") {
      return this.render_array()
    }
    return <TreeItem label={label + " = " + value}></TreeItem>
  }
}

@observer
export class Root extends React.Component<{}> {
  render() {
    return (
      <>
        <SchemaNodeUI isRoot={true} value={{}} schema={flatSchema} />
        <Group label="build" onAdd={() => {}}>
          <TreeItem
            label="base"
            description=" = base value"
            collapsibleState={None}
          ></TreeItem>
          <TreeItem
            label="publish"
            description=" = dir"
            collapsibleState={None}
          ></TreeItem>
          <TreeItem
            label="command"
            description=""
            collapsibleState={None}
          ></TreeItem>
          <Group label="environment" onAdd={() => {}}></Group>
        </Group>
        <Group label="plugins" onAdd={() => {}}></Group>
        <Group label="redirects" onAdd={() => {}}></Group>
        <Group
          label="context"
          onAdd={() => {}}
          collapsibleState={Expanded}
        ></Group>
        <Group label="headers" onAdd={() => {}}></Group>
        <Functions />
        <Group label="dev"></Group>
      </>
    )
  }
}

@observer
class Group extends React.Component<
  {
    onAdd?: () => void
  } & Omit<TreeItemProps, "menu">
> {
  @lazy() get __menu() {
    if (!this.props.onAdd) return undefined
    return menu(menu_def_add, {
      add: this.props.onAdd,
    })
  }
  render() {
    const { onAdd, ...rest } = this.props
    const props = { collapsibleState: Collapsed, ...rest }
    return (
      <TreeItem {...props} menu={this.__menu} collapsibleState={Collapsed}>
        {this.props.children}
      </TreeItem>
    )
  }
}

@observer
export class Functions extends React.Component<{}> {
  private __menu = menu(menu_def_add, {
    add: () => {
      console.log("add function")
    },
  })
  render() {
    return (
      <TreeItem
        label="functions"
        iconPath={icon("circuit-board")}
        menu={this.__menu}
      ></TreeItem>
    )
  }
}
