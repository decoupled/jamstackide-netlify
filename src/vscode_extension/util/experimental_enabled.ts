import vscode from "vscode"
import { VSCodeMeta, keep } from "lambdragon"
import { netlify_ids } from "../util/netlify_ids"

/**
 * checks whether the VSCode configuration
 * 'netlify.experimental.enabled' === true
 *
 * @returns
 */
export function experimental_enabled(): boolean {
  keep(meta)
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
