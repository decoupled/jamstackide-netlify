import { reaction } from "mobx"
import { now } from "mobx-utils"
import React from "react"
import * as toml from "toml"
import vscode from "vscode"
import { lazy } from "x/decorators"
import { json_schema_resolve_refs_in_place } from "x/json_schema/json_schema_resolve_refs"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_json_schema_generator"
import { toml_parse_find_node_2 } from "x/toml/toml_parse_nodes"
import { vscode_mobx } from "x/vscode/vscode_mobx"
import {
  computed,
  menu,
  None,
  observable,
  observer,
  TreeItem,
  TreeItemProps,
} from "../deps"
import { menu_def_add, menu_def_edit } from "../menus"

type OverridesFromParent = Partial<Pick<TreeItemProps, "tooltip">>
export class SchemaNodeUI extends React.Component<
  {
    schema: any
    value: any
    label?: string
    description?: string
    path: (string | number)[]
    onSelect?: (path: (string | number)[]) => void
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
  @lazy() get __menu_edit() {
    return menu(menu_def_edit, {
      edit: () => {
        vscode.window.showInformationMessage("edit!")
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
  render_object(): React.ReactNode {
    const {
      schema,
      value: value_original,
      label,
      description,
      tooltip,
      path,
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
          key={k}
          schema={schema2}
          value={value2}
          label={k}
          path={[...path, k]}
          onSelect={onSelect}
          tooltip={
            schema2.description
              ? new vscode.MarkdownString(schema2.description, true)
              : undefined
          }
        />
      )
      elms.push(elm)
    }
    const canHaveAdditional = !!schema.additionalProperties
    if (path.length === 0) return <>{elms}</>
    const description2 = this.x_label ?? description
    return (
      <TreeItem
        {...label_description(this.isUndefined, label, description2)}
        tooltip={tooltip}
        menu={canHaveAdditional ? this.__menu_add : undefined}
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
        />
      )
    })
    return (
      <TreeItem
        {...label_description(this.isUndefined, label, description)}
        tooltip={tooltip}
        menu={this.__menu_add}
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
          menu={this.__menu_edit}
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
          menu={this.__menu_edit}
          select={this.__onSelect}
        />
      )
    }
  }
}

@observer
export class Root extends React.Component<{}> {
  componentDidMount() {
    reaction(
      () => this.active_netlify_toml_doc_text,
      (txt) => {
        if (typeof txt !== "string") {
          this.parsedDoc = undefined
          this.isStale = false
          return
        }
        try {
          this.parsedDoc = toml.parse(txt)
          this.isStale = false
        } catch {
          this.isStale = true
        }
      },
      { fireImmediately: true }
    )
  }
  @observable private parsedDoc: any = undefined
  @observable private isStale = false

  @computed private get active_netlify_toml_doc_text() {
    now(200)
    return this.active_netlify_toml_doc?.getText()
  }
  @computed private get active_netlify_toml_doc() {
    const doc = vscode_mobx().activeTextEditor$$.document
    if (!doc.fileName.endsWith("netlify.toml")) return undefined
    return doc
  }
  openNode(pos: vscode.Position) {
    const doc = this.active_netlify_toml_doc
    if (!doc) return
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.fileName === doc.fileName
    )
    if (!editor) return
    editor.selection = new vscode.Selection(pos, pos)
    editor.revealRange(new vscode.Range(pos, pos))
  }
  render() {
    if (!this.active_netlify_toml_doc)
      return <TreeItem label="..." collapsibleState={None} />
    const d = this.parsedDoc
    if (!d) return <TreeItem label="..." collapsibleState={None} />
    return (
      <>
        <SchemaNodeUI
          value={d}
          schema={flatSchema}
          path={[]}
          onSelect={(path) => {
            const nn = toml_parse_find_node_2(
              path,
              this.active_netlify_toml_doc_text
            )
            if (nn) {
              const pos = new vscode.Position(nn.line - 1, nn.column)
              this.openNode(pos)
              // vscode.window.showInformationMessage(JSON.stringify(nn))
            } else {
              // vscode.window.showInformationMessage("not found")
            }
          }}
        />
      </>
    )
  }
}

function label_description(
  isUndefined: boolean,
  label: string,
  description?: string
) {
  if (!isUndefined) {
    return { label: "  " + label, description }
  } else {
    return { label: "", description: label }
  }
}

// const flatSchema = json_schema_resolve_refs(netlify_toml_json_schema_generate())
const flatSchema = getSchema() // json_schema_resolve_refs(netlify_toml_json_schema_generate())
function getSchema() {
  const schema = netlify_toml_json_schema_generate()
  json_schema_resolve_refs_in_place(schema)
  return schema
}
