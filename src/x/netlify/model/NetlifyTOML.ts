import { netlify_toml_validator_get_diagnostics } from "src/x/toml/netlify_toml_validator"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import { FileNode } from "./base"
import { Project } from "./Project"

export class NetlifyTOML extends FileNode {
  constructor(public project: Project, filePath: string) {
    super(filePath)
  }

  getDiagnostics() {
    const ds = netlify_toml_validator_get_diagnostics(this.readFileSync())
    return ds.map((diagnostic) => {
      return { diagnostic, uri: this.uri } as ExtendedDiagnostic
    })
  }
}
