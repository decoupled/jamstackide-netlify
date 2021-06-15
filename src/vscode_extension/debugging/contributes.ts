import { values } from "lodash"

const base = "netlify.debug"
export const commands = {
  debug: {
    command: base + ".debug",
    title: "Debug Functions",
    category: "Netlify",
  },
}

export function debugging_contributes() {
  return { commands: values(commands) }
}
