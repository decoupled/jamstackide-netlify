import { lazy } from "x/decorators"
import { memoize } from "lodash"
import { computed, observable } from "mobx"
import { now } from "mobx-utils"
import vscode from "vscode"
import { NetlifyGlobalConfig } from "../NetlifyGlobalConfig"
import { netlify_oauth_config_netlifyvscode } from "../oauth/config/netlify_oauth_config_netlifyvscode"
import { netlify_oauth_get_token } from "../oauth/netlify_oauth_get_token"

const KEY = "NETLIFY_API_TOKEN_KEY"

export const netlify_vsc_oauth_manager = memoize(
  (ctx: vscode.ExtensionContext) => {
    return new NetlifyTokenManager(ctx)
  }
)

class NetlifyTokenManager {
  constructor(public ctx: vscode.ExtensionContext) {}
  // @observable private _authenticating = false
  // get authenticating() {
  //   return this._authenticating
  // }
  @lazy() get config() {
    return netlify_oauth_config_netlifyvscode
  }
  @observable _serial = 0
  @computed get token(): string | undefined {
    const x = [this._serial] // every time serial changes, this @computed value will be invalidated
    x.concat() // prevent treeshaking
    now(500)
    // we don't keep a local copy because the state may be changed in other windows too
    return this.get_cached()
  }
  async logout() {
    await this.set_cached(undefined)
    this._serial++
  }
  async login() {
    // if (this._authenticating) return
    // this._authenticating = true
    let token = await this.useGlobalConfigToken()
    if (token === undefined) return // abort
    if (token === "") token = await netlify_oauth_get_token(this.config)
    if (token) {
      await this.set_cached(token)
      // this._authenticating = false
      this._serial++
    }
    //return token
  }

  // values = "sometoken" | "" (empty string for a new token) | undefined to abort
  private async useGlobalConfigToken() {
    const user = NetlifyGlobalConfig.get().user
    if (!user) return ""
    const token = user.auth?.token
    if (!token) return ""
    const res = await vscode.window.showQuickPick([
      {
        label: `$(account) Use Netlify account "${user.name} (${user.email})"`,
        value: token,
        picked: true,
      },
      {
        label: "$(add) Connect to a different Netlify account...",
        value: "",
      },
    ])
    return res?.value
  }

  async get_token_login_if_needed() {
    if (this.token) return this.token
    await this.login()
    return this.token
  }

  private get globalState() {
    return this.ctx.globalState
  }
  private get_cached() {
    return this.globalState.get<string>(KEY)
  }
  private set_cached(v: string | undefined) {
    return this.globalState.update(KEY, v)
  }
}
