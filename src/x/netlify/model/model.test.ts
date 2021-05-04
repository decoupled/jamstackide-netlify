import { NETLIFY_TOKEN } from "src/secrets"
import { NetlifyAPIWrapper } from "../api/netlify_api"
import { NetlifyWorkspace } from "./model"
describe.skip("netlify_vsc_model", () => {
  const filePath = "/Users/aldo/com.github/decoupled/netlify-test-site"
  test("", async () => {
    const api = new NetlifyAPIWrapper(NETLIFY_TOKEN)
    const workspace = new NetlifyWorkspace({
      workspaceFolders: [filePath],
      api,
    })
    const project = workspace.projects[0]
    const site = await project.site()
    site //?
  })
})
