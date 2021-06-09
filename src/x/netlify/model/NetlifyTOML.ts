import { netlify_toml_validator_get_diagnostics } from "x/toml/netlify_toml_validator"
import { ExtendedDiagnostic } from "x/vscode-languageserver-types/lsp_extensions"
import { FileNode, FilePath } from "./base"
import { IFileSystem } from "x/fs/IFileSystem"

export class NetlifyTOML extends FileNode {
  constructor(filePath: FilePath, fs: IFileSystem) {
    super(filePath, fs)
  }

  getDiagnostics() {
    const ds = netlify_toml_validator_get_diagnostics(this.readFileSync())
    return ds.map((diagnostic) => {
      return { diagnostic, uri: this.uri } as ExtendedDiagnostic
    })
  }
}
