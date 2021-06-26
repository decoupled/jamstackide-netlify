import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import { TreeItemMenu } from "./deps"

const m = netlify_ids.netlify.menus

export const menu_def_authenticating = new TreeItemMenu({
  id: m.authenticating.$id,
  commands: {
    retry: {
      title: "Retry",
      icon: "$(debug-restart)",
      //group: "inline",
    },
  },
})

export const menu_def_logged_in = new TreeItemMenu({
  id: m.logged_in.$id,
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

export const menu_def_site2 = new TreeItemMenu({
  id: m.site2.$id,
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

export const menu_def_add = new TreeItemMenu({
  id: m.add.$id,
  commands: {
    add: {
      title: "Add...",
      icon: "$(add)",
      group: "inline",
    },
  },
})

export const menu_def__add__docs = new TreeItemMenu({
  id: m.add__docs.$id,
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

export const menu_def__docs = new TreeItemMenu({
  id: m.docs.$id,
  commands: {
    docs: {
      title: "Open Documentation",
      icon: "$(question)",
      group: "inline",
    },
  },
})

export const menu_def_snippet = new TreeItemMenu({
  id: m.snippet.$id,
  commands: {
    rename: {
      title: "Rename Snippet...",
      icon: "$(add)",
    },
    change_position: {
      title: "Change Snippet Position...",
      icon: "$(add)",
    },
  },
})

export const menu_def_edit = new TreeItemMenu({
  id: m.edit.$id,
  commands: {
    edit: {
      title: "edit...",
      icon: "$(edit)",
      group: "inline",
    },
  },
})

export const menu_def__edit__docs = new TreeItemMenu({
  id: m.edit__docs.$id,
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

export const menu_def_sites = new TreeItemMenu({
  id: m.sites.$id,
  commands: {
    search: {
      title: "search",
      icon: "$(search)",
      group: "inline",
    },
    add: {
      title: "add",
      icon: "$(add)",
      group: "inline",
    },
  },
})

export const menu_def_site = new TreeItemMenu({
  id: m.site.$id,
  commands: {
    delete: {
      title: "Delete Site...",
      icon: "$(trash)",
    },
    preview: {
      title: "preview",
      icon: "$(open-preview)",
      group: "inline",
    },
    develop: {
      title: "Edit in VSCode...",
      icon: "$(edit)",
    },
  },
})

export const menu_def_deploy_published = new TreeItemMenu({
  id: m.deploy_published.$id,
  commands: {
    preview: {
      title: "preview",
      icon: "$(open-preview)",
      group: "inline",
    },
  },
})

export const menu_def_deploy = new TreeItemMenu({
  id: m.deploy.$id,
  commands: {
    preview: {
      title: "preview",
      icon: "$(open-preview)",
      group: "inline",
    },
    restore: {
      title: "Restore this Version of the Site",
      icon: "$(history)",
      group: "inline",
    },
    restore2: {
      title: "Restore this Version of the Site",
      icon: "$(history)",
    },
  },
})

export const menu_def_forms = new TreeItemMenu({
  id: m.forms.$id,
  commands: {
    doc: {
      title: "View Documentation",
      icon: "$(help)",
      group: "inline",
    },
  },
})
