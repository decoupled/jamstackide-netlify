import * as jst from "x/json_schema/json_schema_typings"

export const processing = new jst.TypeW(() => ({
  type: "object",
  "x-docs":
    "https://docs.netlify.com/configure-builds/file-based-configuration/#post-processing",
  properties: {
    skip_processing: { type: "boolean" },
    css: {
      "x-no-edit-when-empty": true,
      type: "object",
      properties: {
        bundle: { type: "boolean" },
        minify: { type: "boolean" },
      },
      "x-taplo": { initKeys: ["bundle", "minify"] },
    },
    js: {
      "x-no-edit-when-empty": true,
      type: "object",
      properties: {
        bundle: { type: "boolean" },
        minify: { type: "boolean" },
      },
      "x-taplo": { initKeys: ["bundle", "minify"] },
    },
    html: {
      "x-no-edit-when-empty": true,
      type: "object",
      properties: {
        pretty_urls: { type: "boolean" },
      },
      "x-taplo": { initKeys: ["pretty_urls"] },
    },
    images: {
      "x-no-edit-when-empty": true,
      type: "object",
      properties: {
        compress: { type: "boolean" },
      },
      "x-taplo": { initKeys: ["compress"] },
    },
  },
  "x-no-edit-when-empty": true,
}))
