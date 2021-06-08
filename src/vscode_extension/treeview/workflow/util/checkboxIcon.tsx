import { icon } from "../../deps"

export function checkboxIcon(checked = false) {
  return checked ? icon("check") : icon("chrome-maximize")
}
