import { LanguageServer } from "lambdragon"
import { NetlifyLanguageServer } from "./NetlifyLanguageServer"

export const language_server_build_target = new LanguageServer({
  main,
})

function main() {
  // throw new Error("error from language server, process=" + process.version)
  console.log("starting language server...")
  new NetlifyLanguageServer().start()
}
