import { values } from "lodash"
import { commands } from "./commands"
export function develop_locally_contributes() {
  return {
    contributes: {
      commands: [...values(commands)],
    },
  }
}
