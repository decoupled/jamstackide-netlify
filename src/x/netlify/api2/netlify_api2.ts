import NetlifyAPI from "netlify"

/**
 * a super simple wrapper
 */
export class NetlifyApi2 {
  client: NetlifyAPI
  constructor(key: string) {
    this.client = new NetlifyAPI(key)
  }

  async env_get(site_id: string): Promise<Record<string, string>> {
    const s = await this.client.getSite({ site_id })
    return s?.build_settings?.env ?? {}
  }
  async env_set(
    site_id: string,
    env: Record<string, string> | undefined
  ): Promise<void> {
    await this.client.updateSite({
      site_id,
      body: { build_settings: { env: env ?? {} } },
    })
  }
}
