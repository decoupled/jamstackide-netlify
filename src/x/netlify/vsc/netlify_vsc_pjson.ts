import merge from "webpack-merge"
import { netlify_vsc_commands } from "./netlify_vsc_commands"
import { values } from "lodash"

export function netlify_vsc_pjson() {
  let pjson = {}
  pjson = merge(pjson, {
    contributes: { commands: values(netlify_vsc_commands) },
  })
  pjson = merge(pjson, {
    contributes: {
      viewsContainers: {
        activitybar: [
          {
            id: "netlify-view-container",
            title: "Netlify",
            icon: "assets/icons2/netlify.svg",
          },
        ],
      },
    },
  })
  return pjson
}
