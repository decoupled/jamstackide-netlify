import { treeview_outline_method_prefix } from "src/vscode_extension/treeview/outline/treeview_outline_method_prefix"
import { memo } from "src/x/decorators"
import {
  RemoteTreeDataProviderImpl,
  RemoteTreeDataProvider_publishOverLSPConnection,
  TreeItem2,
} from "src/x/vscode"
import { NetlifyLanguageServer } from "./NetlifyLanguageServer"

export class OutlineManager {
  constructor(public server: NetlifyLanguageServer) {}

  @memo() start() {
    const getRoot = async () => {
      return {
        async children() {
          return [
            {
              label: "No Netlify project found :)",
              iconPath: "account",
              tooltip: `
                tooltip!!! **boldy boldy**
                ![img](https://github.com/auchenberg/vscode-browser-preview/blob/master/resources/icon_128.png?raw=true)
                `.trim(),
              children() {
                return [{ label: "hehehe", key: "aaa" }]
              },
            },
          ]
        },
      } as TreeItem2
    }

    const tdp = new RemoteTreeDataProviderImpl(getRoot, 3000)

    RemoteTreeDataProvider_publishOverLSPConnection(
      tdp,
      this.server.connection,
      treeview_outline_method_prefix
    )
  }
}
