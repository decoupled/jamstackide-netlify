import { reaction, transaction } from "mobx"
import { now } from "mobx-utils"
import React from "react"
import { CheckboxUI } from "src/vscode_extension/treeview/workflow/CheckboxUI"
import * as toml from "toml"
import vscode from "vscode"
import { lazy } from "x/decorators"
import { json_schema_resolve_refs_in_place } from "x/json_schema/json_schema_resolve_refs"
import { netlify_toml_inserts_insertPath_vscode } from "x/toml/netlify_toml_inserts"
import { netlify_toml_json_schema_generate } from "x/toml/netlify_toml_json_schema_generator"
import { toml_parse_find_node_2 } from "x/toml/toml_parse_nodes"
import { vscode_mobx } from "x/vscode/vscode_mobx"
import {
  computed,
  Expanded,
  menu,
  None,
  observable,
  observer,
  TreeItem,
  TreeItemProps,
} from "../deps"
import { icon_uri } from "../icon_uri"
import {
  menu_def_add,
  menu_def_edit,
  menu_def__add__docs,
  menu_def__edit__docs,
  menu_def__docs,
} from "../menus"
/*
add these as issues:
- add info (link to docs)
- show hint/description when value is not set
- allow editing
- open netlify.toml 

publish extension:
- 
*/

type OverridesFromParent = Partial<Pick<TreeItemProps, "tooltip">>
class SchemaNodeUI extends React.Component<
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
    if (this.menu__is__add && this.menu__is__docs) {
      return this.__menu_def__add__docs
    }
    if (this.menu__is__edit && this.menu__is__docs) {
      return this.__menu_def__edit__docs
    }
    if (this.menu__is__edit) {
      return this.__menu_edit
    }
    if (this.menu__is__add) {
      return this.__menu_add
    }
    if (this.menu__is__docs) {
      return this.__menu_def__docs
    }

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
    const canHaveAdditional = !!schema.additionalProperties
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

@observer
export class Root extends React.Component<{ ctx: vscode.ExtensionContext }> {
  componentDidMount = () => {
    reaction(
      () => this.active_netlify_toml_doc_text,
      (txt) => {
        process.nextTick(() => {
          // we shouldn't modify observables within a reaction
          // so we just push it out of the loop
          // alternative: we could use rxjs streams (+ mobx)
          transaction(() => {
            if (typeof txt !== "string") {
              this.parsedDoc = undefined
              this.isStale = false
              return
            }
            try {
              const parsed = toml.parse(txt)
              this.parsedDoc = parsed
              this.isStale = false
            } catch (e) {
              console.log(e)
              this.isStale = true
            }
          })
        })
      },
      { fireImmediately: true }
    )
  }
  @observable private parsedDoc: any = undefined
  @observable private isStale = false

  @computed private get active_netlify_toml_doc_text(): string | undefined {
    now(200)
    return this.active_netlify_toml_doc?.getText()
  }
  @computed private get active_netlify_toml_doc() {
    const doc = vscode_mobx().activeTextEditor$$?.document
    if (!doc?.fileName?.endsWith("netlify.toml")) return undefined
    return doc
  }
  @computed private get active_netlify_toml_editor() {
    const editor = vscode_mobx().activeTextEditor$$
    if (!editor) return
    if (!editor.document.fileName.endsWith("netlify.toml")) return undefined
    return editor
  }
  openNode(pos: vscode.Position) {
    const doc = this.active_netlify_toml_doc
    if (!doc) return
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.fileName === doc.fileName
    )
    if (!editor) return
    editor.selection = new vscode.Selection(pos, pos)
    editor.revealRange(
      new vscode.Range(pos, pos),
      vscode.TextEditorRevealType.InCenter
    )
  }
  private __onSelect = (path: (string | number)[]) => {
    try {
      const nn = toml_parse_find_node_2(path, this.active_netlify_toml_doc_text)
      if (nn) {
        const pos = new vscode.Position(nn.line - 1, nn.column)
        this.openNode(pos)
        // vscode.window.showInformationMessage(JSON.stringify(nn))
      } else {
        // vscode.window.showInformationMessage("not found")
      }
    } catch (e) {
      // console.log(e)
    }
  }
  private __onEdit = (path: (string | number)[]) => {
    if (path.some((x) => typeof x !== "string")) {
      vscode.window.showWarningMessage("TOML arrays not supported yet")
    }
    const editor = this.active_netlify_toml_editor
    if (!editor) return
    netlify_toml_inserts_insertPath_vscode(editor, path as any)
  }

  @lazy() get netlify_toml_menu() {
    return menu(menu_def__docs, {
      docs: () => {
        openDocs(
          "https://docs.netlify.com/configure-builds/file-based-configuration/"
        )
      },
    })
  }
  render() {
    if (!this.active_netlify_toml_doc)
      return <TreeItem label="..." collapsibleState={None} />
    const d = this.parsedDoc
    if (!d) return <TreeItem label="..." collapsibleState={None} />
    // the amount of slots at the root has to be exactly one
    return (
      <TreeItem
        label="netlify.toml"
        description={this.isStale ? "SYNTAX ERRORS FOUND" : undefined}
        collapsibleState={Expanded}
        iconPath={icon_uri("netlify", this.props.ctx)}
        menu={this.netlify_toml_menu}
      >
        <SchemaNodeUI
          value={d}
          schema={flatSchema}
          path={[]}
          onSelect={this.__onSelect}
          onEdit={this.__onEdit}
        />
        <CheckboxUI label="show resolved values" />
      </TreeItem>
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

const OPEN_DOCS_IN_VSCODE = false
async function openDocs(url: string) {
  if (!OPEN_DOCS_IN_VSCODE) {
    vscode.env.openExternal(vscode.Uri.parse(url))
  } else {
    const pv = await vscode.commands.executeCommand(
      "browser-preview.openPreview",
      url
    )
  }
}
