import { reaction, transaction } from "mobx"
import { now } from "mobx-utils"
import React from "react"
import { CheckboxUI } from "src/vscode_extension/treeview/workflow/CheckboxUI"
import * as toml from "toml"
import vscode from "vscode"
import { lazy } from "x/decorators"
import { netlify_toml_inserts_insertPath_vscode } from "x/toml/netlify_toml_inserts"
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
} from "../deps"
import { icon_uri } from "../icon_uri"
import { menu_def__docs } from "../menus"
import { SchemaNodeUI } from "./SchemaNode"
import { netlifyTOMLJSONSchema, openDocs } from "./util"

/*
add these as issues:
- add info (link to docs)
- show hint/description when value is not set
- allow editing
*/

@observer
export class ConfigRoot extends React.Component<{
  ctx: vscode.ExtensionContext
}> {
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
      vscode.window.showWarningMessage("Editing TOML arrays not supported yet")
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
  @computed get experimental_enabled() {
    now(500)
    return (
      vscode.workspace
        .getConfiguration("netlify.experimental")
        .get("enabled") === true
    )
  }
  render() {
    if (!this.active_netlify_toml_doc)
      return (
        <TreeItem
          label="(open netlify.toml to see more)"
          collapsibleState={None}
        />
      )
    const d = this.parsedDoc
    if (!d)
      return (
        <TreeItem
          label="(open netlify.toml to see more)"
          collapsibleState={None}
        />
      )
    // the amount of slots at the root has to be exactly one
    return (
      <TreeItem
        label="netlify.toml"
        description={this.isStale ? "SYNTAX ERRORS FOUND" : undefined}
        collapsibleState={Expanded}
        iconPath={icon_uri("netlify", this.props.ctx)}
        menu={this.netlify_toml_menu}
        resourceUri={this.active_netlify_toml_doc.uri}
      >
        <SchemaNodeUI
          value={d}
          schema={netlifyTOMLJSONSchema}
          path={[]}
          onSelect={this.__onSelect}
          onEdit={this.__onEdit}
        />
        {this.experimental_enabled ? (
          <CheckboxUI label="show resolved values" />
        ) : null}
      </TreeItem>
    )
  }
}
