import merge from "webpack-merge"
import { TreeItemMenu } from "./deps"

const base = "netlify.treeview.config.menus"

export const menu_def2__add = new TreeItemMenu({
  id: base + ".menu_def_add",
  commands: {
    add: {
      title: "Add...",
      icon: "$(add)",
      group: "inline",
    },
  },
})

export const menu_def2__add__docs = new TreeItemMenu({
  id: base + ".menu__add__docs",
  commands: {
    add: {
      title: "Add...",
      icon: "$(add)",
      group: "inline",
    },
    docs: {
      title: "Open Documentation",
      icon: "$(question)",
      group: "inline",
    },
  },
})

export const menu_def2__docs = new TreeItemMenu({
  id: base + ".menu__docs",
  commands: {
    docs: {
      title: "Open Documentation",
      icon: "$(question)",
      group: "inline",
    },
  },
})

export const menu_def2__edit = new TreeItemMenu({
  id: base + ".menu_def_edit",
  commands: {
    edit: {
      title: "edit...",
      icon: "$(edit)",
      group: "inline",
    },
  },
})

export const menu_def2__edit__docs = new TreeItemMenu({
  id: base + ".menu__edit__docs",
  commands: {
    edit: {
      title: "edit...",
      icon: "$(edit)",
      group: "inline",
    },
    docs: {
      title: "Open Documentation",
      icon: "$(question)",
      group: "inline",
    },
  },
})

export const menu_def2__logged_in = new TreeItemMenu({
  id: base + ".menu_def_logged_in",
  commands: {
    logout: {
      title: "log out from this account",
      icon: "$(debug-disconnect)",
      group: "inline",
    },
    logout2: {
      title: "log out from this account",
      icon: "$(debug-disconnect)",
    },
  },
})

export const menu_def2__site2 = new TreeItemMenu({
  id: base + ".menu_def_site2",
  commands: {
    unlink: {
      title: "unlink site",
      icon: "$(debug-disconnect)",
      group: "inline",
    },
    unlink2: {
      title: "unlink site",
      icon: "$(debug-disconnect)",
    },
    preview: {
      title: "open",
      icon: "$(open-preview)",
      group: "inline",
    },
    preview2: {
      title: "open",
      icon: "$(open-preview)",
    },
    admin: {
      title: "admin",
      icon: "$(settings-gear)",
      group: "inline",
    },
    admin2: {
      title: "admin",
      icon: "$(settings-gear)",
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
  ]
  return merge({}, ...defs.map((d) => d.contributes()))
}
