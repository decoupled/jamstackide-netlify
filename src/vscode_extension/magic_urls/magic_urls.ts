import { Singleton } from "lambdragon"
import { parse } from "querystring"
import { vscode_window_registerUriHandler_multi } from "src/x/vscode/vscode_window_registerUriHandler_multi"
import vscode from "vscode"
import { DevelopLocallyServiceW } from "../dev/develop_locally"
import { ExtraOpts } from "../dev/types"

export class MagicURLsW implements Singleton {
  constructor(out: vscode.OutputChannel, dls: DevelopLocallyServiceW) {
    vscode_window_registerUriHandler_multi({
      handleUri(uri: vscode.Uri) {
        const msg = `handleUri("${uri.toString()}")`
        out.appendLine(msg)
        console.log(msg)
        if (uri.path !== "/open") return
        const q = parse(uri.query)
        const source = str(q["source"])
        const open = str(q["open"])
        const command = str(q["command"])
        const framework = str(q["framework"])
        const install = str(q["install"])
        const degit = str(q["degit"]) === "true"
        const extraOpts: ExtraOpts = {
          open,
          framework,
          command,
          install,
          degit,
        }
        dls.start({ action: "FromMagicURL", source, extraOpts })
      },
    })
  }
}

function str(x: string | string[] | undefined): string | undefined {
  if (Array.isArray(x)) return x[0]
  if (typeof x !== "string") return undefined
  return x
}
