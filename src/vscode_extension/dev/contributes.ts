import { values } from "lodash"
import { commands } from "./commands"
export function develop_locally_contributes() {
  return {
    commands: [...values(commands)],
  }
}
