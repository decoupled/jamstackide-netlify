const base = "decoupled.netlify.commands"
const category = "Netlify"
export const netlify_vsc_commands = {
  debug: {
    command: base + ".debug",
    title: "Debug",
    category,
  },
  login: {
    command: base + ".login",
    title: "Login to your Netlify account...",
    category,
  },
  logout: {
    command: base + ".logout",
    title: "Logout from your Netlify account...",
    category,
  },
  add_site: {
    command: base + ".add_site",
    title: "Create New Site",
    category,
  },
  register_domain: {
    command: base + ".register_domain",
    title: "Register Domain",
    category,
  },
  add_snippet: {
    command: "_decoupled.netlify.add_snippet",
    title: "Add Snippet",
    category,
  },
  publish_existing_deploy: {
    command: "_decoupled.netlify.publish_existing_deploy",
    title: "Publish this Deploy (make current)",
    category,
  },
  develop_locally: {
    command: "_decoupled.netlify.develop_locally",
    title: "Develop Locally",
    category,
  },
  exec: {
    command: "_decoupled.netlify.internal.exec",
    title: "(exec)",
  },
}
