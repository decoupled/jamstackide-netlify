import { vscode_window_createTerminal_andRun } from "@decoupled/xlib"
import execa from "execa"
import { pathExists } from "fs-extra"
import { BaseError } from "make-error"
import { computed } from "mobx"
import { now } from "mobx-utils"
import { memo } from "@decoupled/xlib"
import { netlify_cli_local_config_json_read_hash } from "x/netlify/cli/netlify_cli_local_config_json_path"
import * as syncify from "x/syncify/syncify_mobx"
import { NetlifyCLIPath, NetlifyCLIPath_createDevTime } from "./NetlifyCLIPath"
export class NetlifyCLINotLinkedError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

export class NetlifyCLINotAuthError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

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
  // @Throttle(300)
  async status(cwd: string): Promise<NetlifyCLIStatusResult> {
    try {
      const res = await this._run(cwd, ["status", "--json"])
      return new NetlifyCLIStatusResult(JSON.parse(res.stdout))
    } catch (e) {
      const str = e.toString()
      if (str.includes("netlify link")) throw new NetlifyCLINotLinkedError(str)
      const res = await this._run(cwd, ["status"])
      if (res.stdout.includes("netlify login"))
        throw new NetlifyCLINotAuthError(res.stdout)
      throw e
    }
  }
  async status_R(
    cwd: string
  ): Promise<
    | NetlifyCLIStatusResult
    | NetlifyCLINotLinkedError
    | NetlifyCLINotAuthError
    | undefined
  > {
    console.log("status_R", cwd)
    try {
      return await this.status(cwd)
    } catch (e) {
      return e
    } finally {
      console.log("status_R done")
    }
  }
  async login(cwd: string) {
    this._run(cwd, ["login"])
  }
  async logout(cwd: string) {
    this._run(cwd, ["logout"])
  }
  async link_inTerminal(cwd: string) {
    vscode_window_createTerminal_andRun({ cmd: "netlify link", cwd: cwd })
  }
  async unlink_inTerminal(cwd: string) {
    vscode_window_createTerminal_andRun({ cmd: "netlify unlink", cwd: cwd })
  }
  async login_inTerminal(cwd: string) {
    vscode_window_createTerminal_andRun({ cmd: "netlify login", cwd: cwd })
  }
  async logout_inTerminal(cwd: string) {
    vscode_window_createTerminal_andRun({ cmd: "netlify logout", cwd: cwd })
  }
  private async _run(cwd: string, args: string[]) {
    const pp = await this.clipath.standard()
    if (!(await pathExists(pp))) {
      throw new Error(`could not find netlify cli --> ${pp}`)
    }
    return await execa(pp, args, {
      cwd,
    })
  }

  @computed get globalConfigHash() {
    now(500)
    return netlify_cli_local_config_json_read_hash()
  }
  @memo() forDir(cwd: string) {
    return new NetlifyCLIWrapperForDir(this, cwd)
  }
}

class NetlifyCLIWrapperForDir {
  constructor(private w: NetlifyCLIWrapper, private cwd: string) {}
  getIt() {
    const hash = this.w.globalConfigHash
    return syncify.await_(() => this.w.status_R(this.cwd))
  }
  status = syncify.toObservableValue(() => this.getIt(), 0)
}

export class NetlifyCLIStatusResult {
  constructor(public data: NetlifyCLI_Status) {}
}

type NetlifyCLI_Status = typeof status_example
const status_example = {
  account: {
    Name: "Aldo Bucchi",
    Email: "aldo.bucchi@gmail.com",
    Teams: {
      "Aldo Bucchi's team": "Collaborator",
    },
  },
  siteData: {
    "site-name": "xenodochial-torvalds-5752f5",
    "config-path":
      "/Users/aldo/com.github/decoupled/netlify-test-site/netlify.toml",
    "admin-url": "https://app.netlify.com/sites/xenodochial-torvalds-5752f5",
    "site-url": "https://xenodochial-torvalds-5752f5.netlify.app",
    "site-id": "f0acc552-da82-4a61-a0d4-2843fcd94695",
  },
} as const

export interface FuncTemplateData {
  name: string
  priority: number
  description: string
  lang: string
}

const netlify_test_site = "/Users/aldo/com.github/decoupled/netlify-test-site"
{
  const pp = NetlifyCLIPath_createDevTime()
  const cliw = new NetlifyCLIWrapper(pp)
  // cliw.functions_create_list_templates()
  const info = await cliw.info(netlify_test_site)
  console.log(info)
}
{
  const pp = NetlifyCLIPath_createDevTime()
  const cliw = new NetlifyCLIWrapper(pp)
  // cliw.functions_create_list_templates()
  try {
    const status = await cliw.status(
      "/Users/aldo/com.github/decoupled/decoupled-main-repo"
    )
  } catch (e) {
    if (e instanceof NetlifyCLINotLinkedError) {
      console.log(e)
    }
    if (e instanceof NetlifyCLINotAuthError) {
      console.log(e)
    }
  }
  // const status = await cliw.status(netlify_test_site)
}
