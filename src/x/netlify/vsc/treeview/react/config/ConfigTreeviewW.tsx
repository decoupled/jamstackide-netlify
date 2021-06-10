import { TreeItem_render } from "lambdragon"
import * as React from "react"
import { Root } from "./ConfigRoot"
import { netlify_vsc_treeview_config_id } from "./treeview_id"

export class ConfigTreeviewW {
  constructor() {
    const root = <Root />
    TreeItem_render(netlify_vsc_treeview_config_id, root)
  }
}
