import { CWD } from "src/vscode_extension/di/CWD"
import { taplo_update_vscode_settings } from "./taplo_update_vscode_settings"

export class TaploUpdateW {
  constructor(cwd: CWD) {
    taplo_update_vscode_settings(cwd.x)
  }
}
