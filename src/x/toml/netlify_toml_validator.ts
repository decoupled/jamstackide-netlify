import * as validations from "@netlify/config/src/validate/validations"
import { parse as toml_parse } from "toml"
import { parse as parsenodes } from "toml/lib/parser"
import * as lsp from "vscode-languageserver-types"
import { netlify_toml_example } from "./netlify_toml_example"
import { getRange } from "./toml-utils"

export function netlify_toml_validator_get_diagnostics(
  netlify_toml_string: string
): lsp.Diagnostic[] {
  const config = toml_parse(netlify_toml_string)
  const errors = validateConfig(config)
  if (!errors) return []
  const nodes = parsenodes(netlify_toml_string)
  const topOfFileRange: lsp.Range = {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 0 },
  }
  return errors.map((err) => {
    const range = getRange(nodes, err)
    return {
      range: range ?? topOfFileRange,
      message: err.message,
      severity: lsp.DiagnosticSeverity.Error,
    } as lsp.Diagnostic
  })
}

{
  netlify_toml_validator_get_diagnostics(netlify_toml_example)
}

function getValidations() {
  return [
    validations.PRE_CASE_NORMALIZE_VALIDATIONS,
    validations.PRE_MERGE_VALIDATIONS,
    validations.PRE_CONTEXT_VALIDATIONS,
    validations.PRE_NORMALIZE_VALIDATIONS,
    validations.POST_NORMALIZE_VALIDATIONS,
  ].flat()
}

function filter_empty_and_flatten(array: any[]) {
  const filtered = array.filter((err) => typeof err !== "undefined")
  if (filtered.length > 0) return filtered.flat()
}

// wrappers on netlify internal functions
function validateConfig(config: any) {
  return filter_empty_and_flatten(
    getValidations().map(({ property, ...validation }) =>
      validateProperty(config, { ...validation, nextPath: property.split(".") })
    )
  )
}

// Validate a single property in the configuration file.
function validateProperty(
  parent: any,
  {
    nextPath: [propName, nextPropName, ...nextPath],
    prevPath = [propName],
    propPath = propName,
    key = propName,
    required,
    check,
    message,
    example,
    warn,
  }: any
) {
  const value = parent[propName]

  if (nextPropName !== undefined) {
    return validateChild({
      value,
      nextPropName,
      prevPath,
      nextPath,
      propPath,
      key,
      required,
      check,
      message,
      example,
      warn,
    })
  }

  if (value === undefined) {
    return checkRequired({ value, required, propPath, prevPath, example })
  }
  try {
    if (check !== undefined && check(value, key, parent)) {
      return
    }
  } catch (err) {
    return
  }

  return reportError({
    prevPath,
    propPath,
    message,
    example,
    warn,
    value,
    key,
    parent,
  })
}

function reportError({ propPath, message, value, key, parent }: any) {
  const messageA =
    typeof message === "function" ? message(value, key, parent) : message

  return {
    kind: "ValueError",
    message: `'${propPath.split(".").pop()}' ${messageA}`,
    propPath,
    value,
  }
}

// Recurse over children (each part of the `property` array).
function validateChild({
  value,
  nextPropName,
  prevPath,
  nextPath,
  propPath,
  ...rest
}: any) {
  if (typeof value === "undefined") return
  if (nextPropName !== "*") {
    return validateProperty(value, {
      ...rest,
      prevPath: [...prevPath, nextPropName],
      nextPath: [nextPropName, ...nextPath],
      propPath: `${propPath}.${nextPropName}`,
      key: nextPropName,
    })
  }

  const errors: any[] = Object.keys(value).map((childProp) =>
    validateChildProp({
      childProp,
      value,
      nextPath,
      propPath,
      prevPath,
      ...rest,
    })
  )
  return filter_empty_and_flatten(errors)
}

// Can use * to recurse over array|object elements.
function validateChildProp({
  childProp,
  value,
  nextPath,
  propPath,
  prevPath,
  ...rest
}: any) {
  if (Array.isArray(value)) {
    const key = Number(childProp)
    return validateProperty(value, {
      ...rest,
      prevPath: [...prevPath, key],
      nextPath: [key, ...nextPath],
      propPath: `${propPath}[${childProp}]`,
      key,
    })
  }

  return validateProperty(value, {
    ...rest,
    prevPath: [...prevPath, childProp],
    nextPath: [childProp, ...nextPath],
    propPath: `${propPath}.${childProp}`,
    key: childProp,
  })
}

// When `required` is `true`, property must be defined, unless its parent is
// `undefined`. To make parent required, set its `required` to `true` as well.
function checkRequired({ value, required, propPath, prevPath, example }: any) {
  if (!required) return

  const message = `'${propPath.split(".").pop()}' is required.`
  return { kind: "RequiredValue", message, propPath }
}
