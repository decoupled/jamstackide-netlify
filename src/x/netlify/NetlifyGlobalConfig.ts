import { join } from "path"
import { homedir } from "os"
import { readJSONSync } from "fs-extra"

export class NetlifyGlobalConfig {
  private constructor() {}
  private get filePath() {
    return join(homedir(), ".netlify", "config.json")
  }
  get data() {
    try {
      return readJSONSync(this.filePath) as NetlifyGlobalConfigData
    } catch (e) {
      return undefined
    }
  }
  get user() {
    const { data } = this
    const uid = data?.userId
    if (!uid) return undefined
    return data?.users[uid]
  }
  static get() {
    return new NetlifyGlobalConfig()
  }
}

const example_config_data = {
  telemetryDisabled: false,
  cliId: "6f0f3ada-5b03-478c-8fdd-689bcebfe927",
  userId: "5ca4dcd8776xxxx",
  users: {
    "5ca4dcd8776xxxx": {
      id: "5ca4dcd8776xxxx",
      name: "Aldo Bucchi",
      email: "aldo.bucchi@gmail.com",
      auth: {
        token: "18b2a72dXXXXXX",
        github: {},
      },
    },
  },
}

type NetlifyUserID = string
export interface NetlifyGlobalConfigData {
  telemetryDisabled?: boolean
  cliId?: string
  userId?: NetlifyUserID
  users: {
    [userId: string]: {
      id: NetlifyUserID
      name: string
      email: string
      auth?: {
        token?: string
        github?: {}
      }
    }
  }
}
