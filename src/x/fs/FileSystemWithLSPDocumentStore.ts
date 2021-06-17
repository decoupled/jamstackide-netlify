import { URLString_fromFile } from "@decoupled/xlib"
import { TextDocuments } from "vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"
import { IFileSystem } from "x/fs/IFileSystem"
import { DefaultFileSystem } from "./DefaultFileSystem"

export class FileSystemWithLSPDocumentStore implements IFileSystem {
  private defaultHost = new DefaultFileSystem()
  constructor(public documents: TextDocuments<TextDocument>) {}
  readFileSync(path: string) {
    const uri = URLString_fromFile(path)
    const doc = this.documents.get(uri)
    if (doc) return doc.getText()
    return this.defaultHost.readFileSync(path)
  }
  existsSync(path: string) {
    return this.defaultHost.existsSync(path)
  }
  readdirSync(path: string) {
    return this.defaultHost.readdirSync(path)
  }
  globSync(pattern: string) {
    return this.defaultHost.globSync(pattern)
  }
  writeFileSync(path: string, contents: string) {
    return this.defaultHost.writeFileSync(path, contents)
  }
}
