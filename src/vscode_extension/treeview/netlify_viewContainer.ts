import { VSCodeViewContainer } from "x/vscode/vscode_elms"

export const netlify_viewContainer = new VSCodeViewContainer({
  _parent: "activitybar",
  id: "netlify",
  title: "Netlify",
  icon: "assets/icons2/netlify.svg",
})
