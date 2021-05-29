import { readFile, readFileSync } from "fs-extra"
import { ArrayLike, ArrayLike_normalize } from "src/x/Array/ArrayLike"
import { lazy, memo } from "src/x/decorators"
import { URL_fromFile } from "src/x/url/URL_fromFile"
import { ExtendedDiagnostic } from "src/x/vscode-languageserver-types/lsp_extensions"
import { DocumentUri } from "vscode-languageserver-types"
import { Host } from "./Host"
import { Project } from "./Project"

export type IDEStuff = any

export abstract class ModelNode {
  abstract get project(): Project
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
  constructor(public filePath: string) {
    super()
  }
  @lazy() get host(): Host {
    return this.project.host
  }
  @lazy() get uri(): DocumentUri {
    return URL_fromFile(this.filePath)
  }

  @memo() readFileSync(): string {
    return this.host.readFileSync(this.filePath)
  }
}
