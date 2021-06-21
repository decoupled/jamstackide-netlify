import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import merge from "webpack-merge"
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
      title: "Open",
      icon: "$(open-preview)",
      group: "inline",
    },
    preview2: {
      title: "Open",
      icon: "$(open-preview)",
    },
    admin: {
      title: "Admin",
      icon: "$(settings-gear)",
      group: "inline",
    },
    admin2: {
      title: "Admin",
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
    create_new_function: {
      icon: "$(add)",
      title: "Create new Function",
    },
  },
})

export function menus_contributes() {
  const defs = [
    menu_def2__add,
    menu_def2__add__docs,
    menu_def2__docs,
    menu_def2__edit,
    menu_def2__edit__docs,
    menu_def2__logged_in,
    menu_def2__site2,
    menu_def2__functions,
  ]
  return merge({}, ...defs.map((d) => d.contributes()))
}
