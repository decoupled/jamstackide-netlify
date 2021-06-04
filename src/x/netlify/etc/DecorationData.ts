import * as lsp from "vscode-languageserver-types"

export enum DecorationType {
  headers__header_name,
  headers__header_value,
  headers__path,
  headers__comment,
  headers__punctuation,
}

const dd = "DecorationData"
export interface DecorationData {
  kind: typeof dd
  type: DecorationType
  range: lsp.Range
}

export function DecorationData_is(x: unknown): x is DecorationData {
  try {
    return (x as any).kind === dd
  } catch {
    return false
  }
}

export function DecorationData_make(
  type: DecorationType,
  range: lsp.Range
): DecorationData {
  return { type, range, kind: "DecorationData" }
}
