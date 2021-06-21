import { netlify_ids } from "../util/netlify_ids"

export function configuration_contributes() {
  return {
    configuration: {
      title: "Netlify",
      properties: {
        [netlify_ids.netlify.experimental.enabled.$id]: {
          type: "boolean",
          default: false,
          description:
            "Enable experimental features in the Netlify VSCode extension",
        },
      },
    },
  }
}
