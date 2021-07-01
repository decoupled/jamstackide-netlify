import vscode from "vscode"
import { VSCodeMeta } from "lambdragon"
import { netlify_ids } from "../util/netlify_ids"

export function experimental_enabled(): boolean {
  meta.keep()
  return (
    vscode.workspace
      .getConfiguration()
      .get(netlify_ids.netlify.experimental.enabled.$id) === true
  )
}

const meta = new VSCodeMeta(() => {
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
})
