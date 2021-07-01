import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import { TreeItemMenu } from "./deps"

const m2 = netlify_ids.netlify.menus2

const add = {
  title: "Add...",
  icon: "$(add)",
  group: "inline",
} as const

const docs = {
  title: "Open Documentation",
  icon: "$(question)",
  group: "inline",
} as const

const edit = {
  title: "Edit...",
  icon: "$(edit)",
  group: "inline",
} as const

const debug = {
  title: "Debug...",
  icon: "$(debug)",
  group: "inline",
} as const

export const menu_def2__add = new TreeItemMenu({
  id: m2.add.$id,
  commands: {
    add,
  },
})

export const menu_def2__add__docs = new TreeItemMenu({
  id: m2.add__docs.$id,
  commands: {
    add,
    docs,
  },
})

export const menu_def2__docs = new TreeItemMenu({
  id: m2.docs.$id,
  commands: {
    docs,
  },
})

export const menu_def2__edit = new TreeItemMenu({
  id: m2.edit.$id,
  commands: {
    edit,
  },
})

export const menu_def2__edit__docs = new TreeItemMenu({
  id: m2.edit__docs.$id,
  commands: {
    edit,
    docs,
  },
})

export const menu_def2__logged_in = new TreeItemMenu({
  id: m2.logged_in.$id,
  commands: {
    logout: {
      title: "Log out from this Account",
      icon: "$(debug-disconnect)",
      group: "inline",
    },
    logout2: {
      title: "Log out from this Account",
      icon: "$(debug-disconnect)",
    },
  },
})

export const menu_def2__site2 = new TreeItemMenu({
  id: m2.site2.$id,
  commands: {
    unlink: {
      title: "Unlink site",
      icon: "$(debug-disconnect)",
      group: "inline",
    },
    unlink2: {
      title: "Unlink site",
      icon: "$(debug-disconnect)",
    },
    preview: {
      title: "Open in Browser",
      icon: "$(open-preview)",
      group: "inline",
    },
    preview2: {
      title: "Open in Browser",
      icon: "$(open-preview)",
    },
    admin: {
      title: "Open Admin (on the Netlify App)",
      icon: "$(settings-gear)",
      group: "inline",
    },
    admin2: {
      title: "Open Admin (on the Netlify App)",
      icon: "$(settings-gear)",
    },
  },
})

export const menu_def2__functions = new TreeItemMenu({
  id: m2.functions.$id,
  commands: {
    add,
    add2: {
      icon: "$(add)",
      title: "Add Function Configuration",
    },
    debug: debug,
    debug2: {
      icon: "$(debug)",
      title: "Debug Functions",
    },
    create_new_function: {
      icon: "$(add)",
      title: "Create new Function",
    },
    docs,
  },
})

export const menu_def2__dev = new TreeItemMenu({
  id: m2.dev.$id,
  commands: {
    start: {
      title: "Start Netlify Dev",
      icon: "$(play)",
      group: "inline",
    },
    debug: {
      title: "Start Netlify Dev in Debug Mode",
      icon: "$(debug)",
      group: "inline",
    },
    docs,
  },
})
