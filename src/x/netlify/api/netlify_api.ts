import moment from "moment"
import NetlifyAPI from "netlify"
import { lazy, memo } from "x/decorators"
import { netlify_vsc_oauth_manager } from "../vsc/netlify_vsc_oauth_manager"
import {
  R_getCurrentUser,
  R_getSite,
  R_listPaymentMethodsForUser,
  R_listSites,
  SiteDeployRaw,
} from "./example_api_responses"

type SiteRaw = R_listSites[number]

export class NetlifyAPIWrapper {
  constructor(private key: string) {}
  @lazy() get client() {
    return new NetlifyAPI(this.key)
  }

  @memo() async sites() {
    const x: any[] = await this.client.listSites()
    if (!x) return []
    return x.map((s) => new NetlifySite(this, s))
  }
  @memo() getCurrentUser(): Promise<R_getCurrentUser> {
    return this.client.getCurrentUser()
  }
  @memo() async paymentMethods() {
    const x: any[] = await this.client.listPaymentMethodsForUser()
    if (!x) return []
    return x.map((s) => new PaymentMethod(this, s))
  }
  @memo() async site_by_repo_url(repo_url: string) {
    return (await this.sites()).find((s) => s.repo_url === repo_url)
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

export class PaymentMethod {
  constructor(
    public api: NetlifyAPIWrapper,
    public raw: R_listPaymentMethodsForUser[number]
  ) {}
  @lazy() get treeview_label() {
    if (this.raw.type === "card") return `card (${this.raw.data.last4})`
    return this.raw.type
  }
}

export class NetlifySite {
  constructor(public api: NetlifyAPIWrapper, public raw: SiteRaw) {}
  get treeItem_tooltip() {
    const d = this.raw.published_deploy
    if (!d) return "no published deploys"
    return `published`
  }
  get name(): string | undefined {
    return this.raw.name
  }
  get id(): string {
    return this.raw.id
  }
  get quickPickItem_label() {
    if (this.custom_domain) return `${this.custom_domain} (${this.name ?? ""})`
    return this.name ?? ""
  }
  get custom_domain(): string | undefined {
    return this.raw.custom_domain ?? undefined
  }
  get admin_url(): string | undefined {
    return this.raw.admin_url
  }
  get url() {
    return this.raw.ssl_url ?? this.raw.url
  }
  async deleteSite() {
    await this.api.client.deleteSite({ site_id: this.id })
  }
  @lazy() get published_deploy(): NetlifySiteDeploy | undefined {
    const d = this.raw.published_deploy
    if (!d) return undefined
    return new NetlifySiteDeploy(this, d as any)
  }
  @memo() async deploys() {
    const deps: any[] = await this.api.client.listSiteDeploys({
      site_id: this.id,
    })
    return deps.map((d) => new NetlifySiteDeploy(this, d))
  }
  @memo() async forms() {
    const fs: any[] = await this.api.client.listForms({ site_id: this.id }) //?
    return fs.map((f) => new NetlifySiteForm(this, f)) //?
  }
  @memo() async snippets() {
    const fs: any[] = await this.api.client.listSiteSnippets({
      site_id: this.id,
    }) //?
    return fs.map((f) => new NetlifySiteSnippet(this, f)) //?
  }
  @memo() getSite(): Promise<R_getSite> {
    return this.api.client.getSite({ site_id: this.raw.site_id })
  }
  get repo_url() {
    return this.raw.build_settings?.repo_url
  }
  get repo_branch() {
    return this.raw.build_settings?.repo_branch
  }
  get isGithub() {
    return this.raw.build_settings?.provider === "github"
  }
}

export class NetlifySiteSnippet {
  constructor(public site: NetlifySite, public raw: any) {}
  get id(): string {
    return this.raw.id
  }
  get title(): string {
    return this.raw.title
  }
  get general_position(): string {
    return this.raw.general_position
  }
  get general(): string {
    return this.raw.general
  }
  get treeview_label(): string {
    return this.title ?? ""
  }
  get treeview_description(): string {
    return this.raw.general_position //?
  }
  get treeview_tooltip() {
    return this.raw.general
  }
  async update(newProps: {
    general?: string
    general_position?: string
    title?: string
  }) {
    const { client } = this.site.api
    const pathParams = { site_id: this.site.id, snippet_id: this.id }
    const currentProps = await client.getSiteSnippet(pathParams)
    if (newProps.general_position) {
      ;(newProps as any).goal_position = newProps.general_position
    }
    const dd = {
      ...pathParams,
      body: {
        ...currentProps,
        ...newProps,
      },
    }
    const res = await client.updateSiteSnippet(dd)
  }
}

export class NetlifySiteForm {
  constructor(public site: NetlifySite, public raw: any) {}
  get name(): string {
    return this.raw.name
  }
  get submission_count(): number {
    return this.raw.submission_count ?? 0
  }
  get treeview_label(): string {
    return this.name
  }
  get treeview_description(): string {
    const n = this.submission_count
    const nn = n === 1 ? "submission" : "submissions"
    return `${n} ${nn}`
  }
  get treeview_tooltip() {
    return ""
  }
  @memo() async submissions() {
    const ss = await this.site.api.client.listFormSubmissions({
      form_id: this.raw.id,
    })
    ss //?
    return ss
  }
}

export class NetlifySiteDeploy {
  constructor(public site: NetlifySite, public raw: SiteDeployRaw) {}
  get treeview_label(): string {
    return this.raw.context
    const { id } = this.raw
    if (!id) return "--"
    return id.substr(id.length - 6)
  }
  get treeview_description() {
    return this.created_ago
  }
  get treeview_tooltip() {
    const d = this.raw.deploy_time
    if (d) return `Deployed in ${d}s`
    return ""
  }
  get id() {
    return this.raw.id!
  }
  get is_published() {
    return this.site.published_deploy?.id === this.id
  }
  get state2(): "loading" | "ready" | "published" {
    if (this.is_published) return "published"
    if (this.state === "ready") return "ready"
    return "loading"
  }
  get treeview_iconPath() {
    switch (this.state2) {
      case "published":
        return "pass"
      case "loading":
        return "loading"
      default:
        return "history"
    }
  }
  get state() {
    return this.raw.state
  }
  get context() {
    return this.raw.context
  }
  get ssl_url__or__url() {
    return this.raw.ssl_url ?? this.raw.url ?? undefined
  }
  get admin_url(): string {
    return this.raw.admin_url
  }
  get created_at() {
    return this.raw.created_at
  }
  @lazy() get created_ago() {
    const x = this.raw.created_at
    if (!x) return
    return formatDate(new Date(x))
  }
  get published_at() {
    return this.raw.published_at
  }
  @lazy() get published_ago() {
    const x = this.raw.published_at
    if (!x) return
    return formatDate(new Date(x))
  }
  get screenshot_url(): string | undefined {
    return this.raw.screenshot_url ?? undefined
  }
  @memo() async build() {
    const { build_id } = this.raw
    if (!build_id) return undefined
    const buildData = await this.site.api.client.getSiteBuild({ build_id })
    console.log(buildData)
    if (!buildData) return undefined
    return new NetlifyBuild(this, buildData)
  }
  async restoreSiteDeploy() {
    const site_id = this.site.id
    const deploy_id = this.id
    await this.site.api.client.restoreSiteDeploy({ site_id, deploy_id })
  }
}

export class NetlifyBuild {
  constructor(public parent: NetlifySiteDeploy, public raw: any) {
    /*
{
"id": "string",
"deploy_id": "string",
"sha": "string",
"done": true,
"error": "string",
"created_at": "string"
}
*/
  }
  get sha() {
    return this.raw.sha
  }
}

function formatDate(d: Date) {
  // https://momentjs.com/
  const now = new Date()
  const m = moment(d)
  if (now.getFullYear() === d.getFullYear()) {
    const diff = now.getTime() - d.getTime()
    if (diff < 6 * 60 * 60 * 1000) {
      return m.format("MMM D [at] h:mm a") + " " + m.fromNow()
    } else {
      return m.format("MMM D [at] h:mm a")
    }
  }
  return m.format("MMM D YYYY [at] h:mm a")
}

// https://netlify-builds1.firebaseio.com/deploys/5e55bfaa1036fdb7aa9759ab/log
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE1OTczMDExODcsImQiOnsidWlkIjoiIn19.1GmTnYeoySwedLmlq69_jZJjjjdQk0e2mDGEOsyr5iw'

// curl "https://netlify-builds1.firebaseio.com/deploys/5e55bfaa1036fdb7aa9759ab/log?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE1OTczMDExODcsImQiOnsidWlkIjoiIn19.1GmTnYeoySwedLmlq69_jZJjjjdQk0e2mDGEOsyr5iw"
