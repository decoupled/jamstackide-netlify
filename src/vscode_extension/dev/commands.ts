import { netlify_ids } from "../util/netlify_ids"

export const commands = {
  develop_locally: {
    command: netlify_ids.netlify.commands.develop_locally.$id,
    title: "Fetch and Develop Locally",
    category: "Netlify",
  },
}
