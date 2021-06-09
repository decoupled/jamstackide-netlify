import { TextDocuments } from "vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"
import { IFileSystem } from "x/fs/IFileSystem"
import { URL_fromFile } from "x/url/URL_fromFile"
import { DefaultFileSystem } from "./DefaultFileSystem"

export class FileSystemWithLSPDocumentStore implements IFileSystem {
  private defaultHost = new DefaultFileSystem()
  constructor(public documents: TextDocuments<TextDocument>) {}
  readFileSync(path: string) {
    const uri = URL_fromFile(path)
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
