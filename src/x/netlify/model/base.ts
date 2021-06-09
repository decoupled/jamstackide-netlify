import { ArrayLike, ArrayLike_normalize } from "src/x/Array/ArrayLike"
import { lazy, memo } from "src/x/decorators"
import { URL_fromFile } from "src/x/url/URL_fromFile"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import { DocumentUri } from "vscode-languageserver-types"
import { IFileSystem } from "../../fs/IFileSystem"

export type IDEStuff = any

export type FilePath = string

export abstract class ModelNode {
  getChildren(): ArrayLike<ModelNode> {
    return null
  }
  getIDEStuff(): ArrayLike<IDEStuff> {
    return null
  }
  getDiagnostics(): ArrayLike<ExtendedDiagnostic> {
    return null
  }
  async collectDiagnostics(): Promise<ExtendedDiagnostic[]> {
    const ours = await ArrayLike_normalize(this.getDiagnostics())
    const children = await ArrayLike_normalize(this.getChildren())
    const rr = children.map((c) => c.getDiagnostics()).map(ArrayLike_normalize)
    const rrr = await Promise.all(rr)
    return [ours, ...rrr].flat()
  }
}

export abstract class FileNode extends ModelNode {
  constructor(public filePath: FilePath, public host: IFileSystem) {
    super()
  }
  @lazy() get uri(): DocumentUri {
    return URL_fromFile(this.filePath)
  }
  @memo() readFileSync(): string {
    return this.host.readFileSync(this.filePath)
  }
}
