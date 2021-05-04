import { LazyGetter as lazy } from "lazy-get-decorator"
import { Memoize as memo } from "lodash-decorators"
import { computed, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import vscode from "vscode"
import { vsc_assets_icon_uri } from "../../../../../vsc/studio_treeview/vsc_assets_icon"
import { develop_locally } from "../../../../jamstackide/vsc/dev/develop_locally"
import {
  TreeItem,
  TreeItemMenu_create,
} from "../../../../vscode/treeview/react2"
import { vscode_ThemeIcon_memo as icon } from "../../../../vscode/vscode_ThemeIcon_memo"
import {
  NetlifyAPIWrapper,
  NetlifySite,
  NetlifySiteDeploy,
  NetlifySiteForm,
  NetlifySiteSnippet,
  PaymentMethod,
} from "../../../api/netlify_api"
import { netlify_vsc_oauth_manager } from "../../netlify_vsc_oauth_manager"
import { LinkUI } from "./LinkUI"
import {
  menu_def_add,
  menu_def_deploy,
  menu_def_deploy_published,
  menu_def_edit,
  menu_def_logged_in,
  menu_def_site,
  menu_def_sites,
  menu_def_snippet,
} from "./menus"

const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState

@observer
export class NetlifyUI extends React.Component<{
  ctx: vscode.ExtensionContext
}> {
  render() {
    return (
      <TreeItem
        label="netlify accounts"
        collapsibleState={Expanded}
        iconPath={vsc_assets_icon_uri("netlify", this.props.ctx)}
      >
        <NetlifyAccountsUI ctx={this.props.ctx} />
      </TreeItem>
    )
  }
}

@observer
export class NetlifyAccountsUI extends React.Component<{
  ctx: vscode.ExtensionContext
}> {
  @computed get token() {
    return netlify_vsc_oauth_manager(this.props.ctx).token
  }
  @computed get api() {
    if (!this.token) return undefined
    return new NetlifyAPIWrapper(this.token)
  }
  private do_login = () => netlify_vsc_oauth_manager(this.props.ctx).login()
  render__logged_out() {
    return (
      <TreeItem
        key="xx"
        label="click here to add account..."
        iconPath={icon("add")}
        select={this.do_login}
        collapsibleState={None}
      />
    )
  }

  render__authenticating() {
    return (
      <TreeItem
        key="xx"
        label="authenticating with netlify..."
        iconPath={vsc_assets_icon_uri("netlify", this.props.ctx)}
        collapsibleState={None}
      />
    )
  }

  render() {
    if (this.api)
      return (
        <NetlifyAccountTreeItem_LoggedIn api={this.api} ctx={this.props.ctx} />
      )
    // if (netlify_vsc_oauth_manager(this.props.ctx).authenticating) {
    //   return this.render__authenticating()
    // }
    return this.render__logged_out()
  }
}

@observer
export class NetlifyAccountTreeItem_LoggedIn extends React.Component<{
  api: NetlifyAPIWrapper
  ctx: vscode.ExtensionContext
}> {
  @observable label: string | undefined
  async componentDidMount() {
    const u = await this.props.api.getCurrentUser()
    this.label = `${u.slug} (${u.full_name})`
  }
  private menu_logged_in = TreeItemMenu_create(menu_def_logged_in, {
    logout: () => {
      netlify_vsc_oauth_manager(this.props.ctx).logout()
    },
    logout2: () => {
      netlify_vsc_oauth_manager(this.props.ctx).logout()
    },
  })
  render() {
    return (
      <TreeItem
        label={this.label ?? "fetching account details..."}
        iconPath={icon("account")}
        menu={this.menu_logged_in}
        collapsibleState={Expanded}
      >
        <Sites api={this.props.api} ctx={this.props.ctx} />
        <AccountSettings api={this.props.api} />
      </TreeItem>
    )
  }
}

@observer
export class AccountSettings extends React.Component<{
  api: NetlifyAPIWrapper
}> {
  render() {
    return (
      <TreeItem
        label="account settings"
        iconPath={icon("account")}
        collapsibleState={Collapsed}
      >
        <AccountSettings_PaymentMethodsUI api={this.props.api} />
      </TreeItem>
    )
  }
}

@observer
export class AccountSettings_PaymentMethodsUI extends React.Component<{
  api: NetlifyAPIWrapper
}> {
  @observable data: PaymentMethod[] = []
  @memo() async fetch() {
    this.data = await this.props.api.paymentMethods()
  }
  render() {
    return (
      <TreeItem label="payment methods" iconPath={icon("credit-card")}>
        {() => {
          this.fetch()
          return this.data.map((s, i) => (
            <AccountSettings_PaymentMethods_MethodUI key={i} data={s} />
          ))
        }}
      </TreeItem>
    )
  }
}

@observer
export class AccountSettings_PaymentMethods_MethodUI extends React.Component<{
  data: PaymentMethod
}> {
  private menu_edit = TreeItemMenu_create(menu_def_edit, {
    edit: () => {
      vscode.env.openExternal(
        vscode.Uri.parse(
          // TODO: replace with user's URL. This is just for testing
          "https://app.netlify.com/teams/aldonline/billing/general#payment-information"
        )
      )
    },
  })
  render() {
    return (
      <TreeItem
        label={this.props.data.treeview_label}
        iconPath={icon("credit-card")}
        menu={this.menu_edit}
        collapsibleState={None}
      />
    )
  }
}

@observer
export class Sites extends React.Component<{
  api: NetlifyAPIWrapper
  ctx: vscode.ExtensionContext
}> {
  @observable data: NetlifySite[] = []
  @memo() async fetch() {
    this.data = await this.props.api.sites()
  }
  private menu = TreeItemMenu_create(menu_def_sites, {
    add: () => {
      vscode.window.showInformationMessage("add")
    },
    search: () => {
      vscode.window.showInformationMessage("search")
    },
  })
  render() {
    return (
      <TreeItem label="sites" iconPath={icon("browser")} menu={this.menu}>
        {() => {
          this.fetch()
          return this.data.map((s) => (
            <Site site={s} key={s.id} ctx={this.props.ctx} />
          ))
        }}
      </TreeItem>
    )
  }
}

@observer
export class Site extends React.Component<{
  site: NetlifySite
  ctx: vscode.ExtensionContext
}> {
  private addDomain = () => {
    vscode.window.showInformationMessage("add domain??")
  }
  private develop_locally_cb = () => {
    const source = this.props.site.repo_url
    if (!source) return
    develop_locally(
      {
        action: "FromNetlifyExplorer",
        source,
      },
      this.props.ctx
    )
  }
  private develop_locally__render() {
    const { site } = this.props
    if (!site.repo_url) return null
    return (
      <TreeItem
        label="develop locally..."
        description="clone and develop site locally"
        tooltip="clone repo and use Netlify Dev"
        iconPath={icon("remote-explorer")}
        collapsibleState={None}
        select={this.develop_locally_cb}
      />
    )
  }

  private snippets__render() {
    return <SiteSnippets site={this.props.site} />
  }

  private menu = TreeItemMenu_create(menu_def_site, {
    preview: () => {
      const {
        site: { url },
      } = this.props
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
    delete: async () => {
      const { site } = this.props
      const value = await vscode.window.showInputBox({
        prompt: `Warning: Deleting a site cannot be undone.
        To continue please re-enter the site name (${site.name})`,
      })
      if (!value) return
      if (value === site.name || value === "!!!") {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Deleting site ${site.name}`,
          },
          async () => {
            try {
              await site.deleteSite()
            } catch (e) {
              if (e) {
                vscode.window.showErrorMessage(String(e))
              }
            }
          }
        )
      } else {
        vscode.window.showInformationMessage(
          `you entered a different site name. please try again`
        )
      }
    },
    develop: async () => {
      const source = this.props.site.repo_url
      if (!source) return
      develop_locally(
        {
          action: "FromNetlifyExplorer",
          source,
        },
        this.props.ctx
      )
    },
  })

  @lazy() get envVarsUri() {
    return vscode.Uri.parse(`netlify-api:/env/${this.props.site.id}/.env`)
  }
  private onEnvVarClick = () => {
    vscode.window.showTextDocument(this.envVarsUri)
  }

  render() {
    const { site } = this.props
    const { custom_domain, admin_url, url } = site
    //        iconPath={icon("browser")}
    return (
      <TreeItem
        label={site.name}
        tooltip={site.treeItem_tooltip}
        description={custom_domain ?? ""}
        menu={this.menu}
      >
        {() => {
          return (
            <>
              <SiteDeploys site={site} />
              {url && <LinkUI label="open site" url={url} />}
              {url && (
                <LinkUI
                  label="open site in vscode browser"
                  url={url}
                  useVSCodeBrowser={true}
                />
              )}
              {admin_url && <LinkUI label="open admin" url={admin_url} />}
              {!custom_domain && (
                <TreeItem
                  label="add domain..."
                  iconPath={icon("globe")}
                  tooltip="register a new domain for this site"
                  select={this.addDomain}
                  collapsibleState={None}
                />
              )}
              <SiteForms site={site} />
              <TreeItem
                label="analytics"
                iconPath={icon("graph")}
                collapsibleState={None}
              />
              <TreeItem
                label="large media"
                iconPath={icon("file-media")}
                collapsibleState={None}
              />
              <TreeItem
                label="identity"
                iconPath={icon("person")}
                collapsibleState={None}
              />
              <TreeItem
                label="build.env"
                description="environment variables (build)"
                iconPath={icon("symbol-namespace")}
                collapsibleState={None}
                //resourceUri={this.envVarsUri}
                select={this.onEnvVarClick}
              />
              {this.develop_locally__render()}
              {this.snippets__render()}
            </>
          )
        }}
      </TreeItem>
    )
  }
}

@observer
export class SiteForms extends React.Component<{ site: NetlifySite }> {
  @observable data: NetlifySiteForm[] = []
  @memo() async fetch() {
    this.data = await this.props.site.forms()
  }
  render() {
    return (
      <TreeItem label="forms" iconPath={icon("feedback")}>
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteForm key={x.name} data={x} />)
        }}
      </TreeItem>
    )
  }
}

@observer
export class SiteSnippets extends React.Component<{ site: NetlifySite }> {
  @observable data: NetlifySiteSnippet[] = []
  @memo() async fetch() {
    this.data = await this.props.site.snippets()
  }
  private snippets__menu = TreeItemMenu_create(menu_def_add, {
    add: () => {
      console.log("add snippet...")
    },
  })
  render() {
    return (
      <TreeItem
        label="snippets"
        iconPath={icon("code")}
        menu={this.snippets__menu}
      >
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteSnippet key={x.id} data={x} />)
        }}
      </TreeItem>
    )
  }
}

@observer
export class SiteSnippet extends React.Component<{ data: NetlifySiteSnippet }> {
  @lazy() get contentUri() {
    const x = this.props.data
    const uri = `netlify-api:/snippets/${x.site.id}/${x.id}/snippet-content.html`
    return vscode.Uri.parse(uri)
  }
  private onSelect = () => {
    vscode.window.showTextDocument(this.contentUri)
  }
  private snippet__menu = TreeItemMenu_create(menu_def_snippet, {
    rename: () => {
      vscode.window.showInformationMessage("TODO: implement snippet.rename()")
    },
    change_position: () => {
      const currentValue = this.props.data.general_position
      const header = {
        label: "Header",
        description: "Insert snippet before </head>",
        picked: currentValue === "header",
        _value: "header",
      }
      const footer = {
        label: "Footer",
        description: "Insert snippet before </body>",
        picked: currentValue === "footer",
        _value: "footer",
      }
      const qp = vscode.window.createQuickPick<typeof header>()
      qp.title = "Choose Snippet Position"
      qp.items = [header, footer]
      qp.show()
      qp.onDidAccept(async () => {
        const item = qp.selectedItems[0]
        if (item) {
          if (item._value !== currentValue) {
            try {
              qp.busy = true
              qp.title = "Updating Snippet Position"
              await this.props.data.update({ general_position: item._value })
              qp.busy = false
            } catch (e) {
              vscode.window.showErrorMessage(e + "")
            }
          }
        }
        qp.dispose()
      })
    },
  })
  render() {
    const f = this.props.data
    return (
      <TreeItem
        label={f.treeview_label}
        description={f.treeview_description}
        tooltip={f.treeview_tooltip}
        // iconPath={icon("code")}
        select={this.onSelect}
        collapsibleState={None}
        menu={this.snippet__menu}
        resourceUri={this.contentUri}
      />
    )
  }
}

@observer
export class SiteForm extends React.Component<{ data: NetlifySiteForm }> {
  render() {
    const f = this.props.data
    return (
      <TreeItem
        label={f.treeview_label}
        description={f.treeview_description}
        iconPath={icon("feedback")}
      >
        <TreeItem
          label="download as json"
          iconPath={icon("desktop-download")}
          collapsibleState={None}
        ></TreeItem>
        <TreeItem
          label="download as csv"
          iconPath={icon("desktop-download")}
          collapsibleState={None}
        ></TreeItem>
        {/* <TreeItem label="submissions..."></TreeItem> */}
      </TreeItem>
    )
  }
}

@observer
export class SiteDeploys extends React.Component<{ site: NetlifySite }> {
  @observable data: NetlifySiteDeploy[] = []
  @memo() async fetch() {
    this.data = await this.props.site.deploys()
  }
  render() {
    return (
      <TreeItem label="deploys" iconPath={icon("versions")}>
        {() => {
          this.fetch()
          return this.data.map((x) => <SiteDeployUI key={x.id} data={x} />)
        }}
      </TreeItem>
    )
  }
}

@observer
export class SiteDeployUI extends React.Component<{ data: NetlifySiteDeploy }> {
  get iconPath() {
    const d = this.props.data
    //return icon(d.treeview_iconPath)
    if (d.state2 === "published") return icon("circle-filled")
    if (d.state2 === "loading") return icon("loading")
    return icon("circle-outline")
  }

  private restore = async () => {
    const d = this.props.data
    const mm = "Yes! Restore this Deploy"
    const res = await vscode.window.showInformationMessage(
      "Restore this deploy? This will become the published version of your site.",
      { modal: true },
      mm
    )
    if (res !== mm) return
    vscode.window.withProgress(
      {
        title: `Restoring site ${d.site.name} to a previous deploy`,
        location: vscode.ProgressLocation.Notification,
      },
      async () => {
        await this.props.data.restoreSiteDeploy()
        vscode.window.showInformationMessage("Site restored!")
      }
    )
  }

  private menu = TreeItemMenu_create(menu_def_deploy, {
    preview: () => {
      const r = this.props.data.raw
      const url = r.deploy_ssl_url ?? r.deploy_url
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
    restore: this.restore,
    restore2: this.restore,
  })

  private menu_published = TreeItemMenu_create(menu_def_deploy_published, {
    preview: () => {
      const url = this.props.data.ssl_url__or__url
      if (url)
        return vscode.commands.executeCommand(
          "browser-preview.openPreview",
          url
        )
    },
  })

  render() {
    const d = this.props.data
    const msgs = d?.raw?.summary?.messages ?? []
    return (
      <TreeItem
        label={d.treeview_label}
        iconPath={this.iconPath}
        description={d.treeview_description}
        tooltip={d.treeview_tooltip}
        collapsibleState={Collapsed}
        menu={d.state2 === "published" ? this.menu_published : this.menu}
      >
        <LinkUI label="open preview" url={d.ssl_url__or__url} />
        <LinkUI
          label="open preview in vscode browser"
          url={d.ssl_url__or__url}
          useVSCodeBrowser={true}
        />
        <LinkUI label="open admin" url={d.admin_url!} />
        <TreeItem
          label={"state: " + d.state}
          iconPath={icon("circle-outline")}
          collapsibleState={None}
        />
        <TreeItem
          label="summary"
          iconPath={icon("checklist")}
          collapsibleState={Collapsed}
        >
          {msgs.map((m, i) => {
            return (
              <TreeItem
                key={i}
                label={m.title}
                tooltip={`${m.description}\n${m.details}`}
                collapsibleState={None}
              />
            )
          })}
        </TreeItem>
      </TreeItem>
    )
  }
}

// POST /api/v1/sites/:site_id/deploys/:deploy_id/restore
