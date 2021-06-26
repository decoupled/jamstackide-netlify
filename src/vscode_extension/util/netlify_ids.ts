import { vscode_ids } from "@decoupled/xlib"

export const netlify_ids = vscode_ids({
  netlify: {
    experimental: {
      enabled: {},
    },
    commands: {
      create_function_config: {},
      create_function: {},
      add_redirect: {},
      add_context: {},
      add_custom_header: {},
      add_edge_handler: {},
      develop_locally: {},
      debug: {},
    },
    views: {
      shortcuts: {},
    },
    menus: {
      authenticating: {},
      logged_in: {},
      site2: {},
      add: {},
      add__docs: {},
      docs: {},
      snippet: {},
      edit: {},
      edit__docs: {},
      sites: {},
      site: {},
      deploy_published: {},
      deploy: {},
      forms: {},
    },
    // menus2 are created with the vscode_react package of @decoupled/xlib
    menus2: {
      add: {},
      add__docs: {},
      docs: {},
      edit: {},
      edit__docs: {},
      logged_in: {},
      site2: {},
      functions: {},
    },
  },
} as const)
