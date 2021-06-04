import { lazy } from "src/x/decorators"
import vscode from "vscode"
import { Singleton } from "lambdragon"

export class OutputChannelW implements Singleton {
  constructor() {}
  @lazy() get out() {
    return vscode.window.createOutputChannel("Netlify")
  }
}
