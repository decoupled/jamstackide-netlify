import vscode from "vscode"

interface Opts {
  token: string
}

class NetlifyVSCOperationsHelper {
  constructor(public opts: Opts) {}
}
