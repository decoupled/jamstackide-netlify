import { TreeItem_Menu_def as menudef, TreeItem_Menu_to_json } from "lambdragon"
import { netlify_ids } from "src/vscode_extension/util/netlify_ids"
import merge from "webpack-merge"

const m = netlify_ids.netlify.menus

export const menu_def_authenticating = menudef({
  id: m.authenticating.$id,
  commands: {
    retry: {
      title: "Retry",
      icon: "$(debug-restart)",
      //group: "inline",
    },
  },
})

export const menu_def_logged_in = menudef({
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

export const menu_def_site2 = menudef({
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

export const menu_def_add = menudef({
  id: m.add.$id,
  commands: {
    add: {
      title: "Add...",
      icon: "$(add)",
      group: "inline",
    },
  },
})

export const menu_def__add__docs = menudef({
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

export const menu_def__docs = menudef({
  id: m.docs.$id,
  commands: {
    docs: {
      title: "Open Documentation",
      icon: "$(question)",
      group: "inline",
    },
  },
})

export const menu_def_snippet = menudef({
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

export const menu_def_edit = menudef({
  id: m.edit.$id,
  commands: {
    edit: {
      title: "edit...",
      icon: "$(edit)",
      group: "inline",
    },
  },
})

export const menu_def__edit__docs = menudef({
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

export const menu_def_sites = menudef({
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

export const menu_def_site = menudef({
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

export const menu_def_deploy_published = menudef({
  id: m.deploy_published.$id,
  commands: {
    preview: {
      title: "preview",
      icon: "$(open-preview)",
      group: "inline",
    },
  },
})

export const menu_def_deploy = menudef({
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

export const menu_def_forms = menudef({
  id: m.forms.$id,
  commands: {
    doc: {
      title: "View Documentation",
      icon: "$(help)",
      group: "inline",
    },
  },
})

export function menus_contributes() {
  const defs = [
    //menu_def_logged_out,
    menu_def_authenticating,
    menu_def_logged_in,
    menu_def_edit,
    menu_def_add,
    menu_def_sites,
    menu_def_site,
    menu_def_deploy_published,
    menu_def_deploy,
    menu_def_forms,
    menu_def_snippet,
    menu_def__add__docs,
    menu_def__docs,
    menu_def__edit__docs,
  ]
  return merge({}, ...defs.map(TreeItem_Menu_to_json)).contributes
}

{
  TreeItem_Menu_to_json(menu_def_forms)
  menus_contributes()
}
