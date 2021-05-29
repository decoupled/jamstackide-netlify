import { LanguageServer } from "lambdragon"
import { NetlifyLanguageServer } from "./NetlifyLanguageServer"

export const language_server_build_target = new LanguageServer({
  main: startLanguageServer,
})

function startLanguageServer() {
  // throw new Error("error from language server, process=" + process.version)
  console.log("starting language server...")
  new NetlifyLanguageServer().start()
}
