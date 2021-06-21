import { values } from "lodash"
import { netlify_ids } from "../util/netlify_ids"

export const commands = {
  debug: {
    command: netlify_ids.netlify.commands.debug.$id,
    title: "Debug Functions",
    category: "Netlify",
  },
}

export function debugging_contributes() {
  return { commands: values(commands) }
}
