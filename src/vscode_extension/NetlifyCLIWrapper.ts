import execa from "execa"
import { NetlifyCLIPath, NetlifyCLIPath_createDevTime } from "./NetlifyCLIPath"

export class NetlifyCLIWrapper {
  constructor(private clipath: NetlifyCLIPath) {}
  async functions_create_list_templates() {
    const res = await execa(await this.clipath.withIDESupport(), [
      "functions:create",
      "--ide_templates",
    ])
    return JSON.parse(res.stdout) as FuncTemplateData[]
  }
  async info(cwd: string) {
    const res = await execa(await this.clipath.withIDESupport(), ["ide"], {
      cwd,
    })
    return JSON.parse(res.stdout)
  }
}

export interface FuncTemplateData {
  name: string
  priority: number
  description: string
  lang: string
}

{
  const pp = NetlifyCLIPath_createDevTime()
  const cliw = new NetlifyCLIWrapper(pp)
  // cliw.functions_create_list_templates()
  const info = await cliw.info(
    "/Users/aldo/com.github/decoupled/netlify-test-site"
  )
  console.log(info)
}
