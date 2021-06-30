import * as jst from "x/json_schema/json_schema_typings"

export const environment = new jst.TypeW(() => ({
  description: "Environment Variables",
  type: "object",
  additionalProperties: { type: "string" },
}))
