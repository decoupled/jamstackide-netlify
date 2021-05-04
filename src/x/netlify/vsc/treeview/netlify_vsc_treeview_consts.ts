import { mapValues, values } from "lodash"

export const netlify_vsc_treeview_id = "decoupled.studio.netlify.treeview"

export const netlify_vsc_treeview_config_key_astenable =
  "decoupled_studio_netlify_vsc_treeview.enable"

export const netlify_vsc_treeview_context_netlifyEnable = "d_netlifyEnable"

export function getContextValue(str: string): string {
  return `${netlify_vsc_treeview_id}.contextValue.${str}`
}

export const commands = addCommandPropertyFromKey(
  {
    doc: {
      title: "Documentation",
      icon: icon2("help"),
    },
    select: {
      title: "Select",
    },
    refresh: {
      title: "Refresh",
      icon: icon2("refresh"),
    },
    add: {
      title: "Add",
      icon: icon2("add"),
    },
    run: {
      title: "Run",
      icon: icon2("play"),
    },
    edit: {
      title: "Edit",
      icon: icon2("edit"),
    },
    openInBrowser: {
      title: "Open in Browser",
      icon: icon2("open_in_browser"),
    },
    openComponent: {
      title: "Open React Component",
      icon: icon2("open_component"),
    },
    openRoute: {
      title: "Open Route Definition",
      icon: icon2("open_route"),
    },
    delete: {
      title: "Delete",
    },
    dev_server_start: {
      title: "Start Dev Server",
    },
    dev_server_stop: {
      title: "Stop Dev Server",
    },
    dev_server_restart: {
      title: "Restart Dev Server",
    },
    db_up: {
      title: "rw db up",
    },
  },
  `${netlify_vsc_treeview_id}.commands.`
)

export type Command = keyof typeof commands

export const itemTypes: {
  [k: string]: { inline?: Command[]; context?: Command[] }
} = {
  // ---- start new
  withDoc: {
    inline: ["doc"],
  },
  cli: {
    inline: ["run", "doc"],
  },
  group: {
    inline: ["add", "doc"],
  },
  route: {
    inline: ["openComponent", "openInBrowser", "openRoute"],
  },

  // ----- end new

  with__add: {
    inline: ["add"],
  },
  with__doc: {
    inline: ["doc"],
  },
  with__add__doc: {
    inline: ["add", "doc"],
  },
  pages: {
    inline: ["add"],
  },
  page: {
    inline: ["openComponent", "openInBrowser", "openRoute"],
    context: ["delete"],
  },
  layouts: {
    inline: ["add"],
  },
  layout: {
    context: ["delete"],
  },
  cells: {
    inline: ["add"],
  },
  cell: {
    context: ["delete"],
  },
  components: {
    inline: ["add"],
  },
  component: {
    context: ["delete"],
  },
  services: {
    inline: ["add"],
  },
  service: {
    context: ["delete"],
  },
  dev_server_stopped: {
    context: ["dev_server_start"],
  },
  dev_server_running: {
    context: ["dev_server_stop", "dev_server_restart"],
  },
  schema_prisma: {
    context: ["db_up"],
  },
}

export type NodeType = keyof typeof itemTypes

export function ___buildmeta___() {
  return { pjson: netlify_vsc_treeview_pjson() }
}

const netlify_vsc_treeview_pjson = () => {
  const isThisView = `view == ${netlify_vsc_treeview_id}`
  return {
    contributes: {
      commands: [...values(commands)],
      menus: {
        "view/title": [
          {
            command: commands.refresh.command,
            when: isThisView,
            group: "navigation",
          },
        ],
        "view/item/context": [...addMenus2()],
      },
      configuration: {
        properties: {
          [netlify_vsc_treeview_config_key_astenable]: {
            type: "boolean",
            default: true,
            description: "Enable/disable Netlify Explorer (Tree View)",
          },
        },
      },
      views: {
        "netlify-view-container": [
          {
            id: netlify_vsc_treeview_id,
            name: "Netlify",
            when: netlify_vsc_treeview_context_netlifyEnable,
          },
        ],
      },
    },
  }

  function* addMenus2() {
    for (const nodeType of Object.keys(itemTypes)) {
      const nn = itemTypes[nodeType]
      const when = `${isThisView} && viewItem == ${getContextValue(nodeType)}`
      for (const cc of nn.context ?? []) {
        yield {
          command: commands[cc].command,
          when,
        }
      }
      for (const cc of nn.inline ?? []) {
        yield {
          command: commands[cc].command,
          when,
          group: "inline",
        }
      }
    }
  }
}

function icon2(name: string) {
  return `assets/icons2/${name}.svg`
}

function addCommandPropertyFromKey<T extends object>(
  cmds: T,
  base: string
): { [K in keyof T]: T[K] & { command: string } } {
  return mapValues(cmds, (cmd, k) => ({ ...cmd, command: base + k })) as any
}
