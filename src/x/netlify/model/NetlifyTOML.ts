import { FileNode } from "./base"
import { Project } from "./Project"

export class NetlifyTOML extends FileNode {
  constructor(public project: Project, filePath: string) {
    super(filePath)
  }
}
