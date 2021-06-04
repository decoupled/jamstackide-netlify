import * as lsp from "vscode-languageserver-types"
export type DocumentSymbol2 = lsp.DocumentSymbol & { uri: lsp.DocumentUri }
