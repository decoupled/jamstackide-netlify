import merge from "webpack-merge"
import { TreeItem_Menu_def as def, TreeItem_Menu_to_json } from "lambdragon"

const base = "jamstack.netlify.treeview.menus"

export const menu_def_authenticating = def({
  id: base + ".menu_def_authenticating",
  commands: {
    retry: {
      title: "Retry",
      icon: "$(debug-restart)",
      //group: "inline",
    },
  },
})

export const menu_def_logged_in = def({
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

export const menu_def_add = def({
  id: base + ".menu_def_add",
  commands: {
    add: {
      title: "add...",
      icon: "$(add)",
      group: "inline",
    },
  },
})

export const menu_def_snippet = def({
  id: base + ".menu_def_snippet",
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

export const menu_def_edit = def({
  id: base + ".menu_def_edit",
  commands: {
    edit: {
      title: "edit...",
      icon: "$(edit)",
      group: "inline",
    },
  },
})

export const menu_def_sites = def({
  id: base + ".menu_def_sites",
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

export const menu_def_site = def({
  id: base + ".menu_def_site",
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

export const menu_def_deploy_published = def({
  id: base + ".menu_def_deploy_published",
  commands: {
    preview: {
      title: "preview",
      icon: "$(open-preview)",
      group: "inline",
    },
  },
})

export const menu_def_deploy = def({
  id: base + ".menu_def_deploy",
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

export const menu_def_forms = def({
  id: base + ".menu_def_forms",
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
  ]
  return merge({}, ...defs.map(TreeItem_Menu_to_json))
}

{
  TreeItem_Menu_to_json(menu_def_forms)
  menus_contributes()
}
