import { iter } from "../../../Iterable/iter"
import { TreeItemBuilder } from "../../../vscode/TreeDataProvider/serializable/types"
import { NetlifyAPIWrapper, NetlifySite } from "../../api/netlify_api"
import { netlify_vsc_commands } from "./../netlify_vsc_commands"

export function netlify_vsc_treeview_build(): TreeItemBuilder {
  const api = new NetlifyAPIWrapper("")
  return {
    label: "Netlify",
    async children() {
      return [
        {
          label: "sites",
          iconPath: "browser",
          menu: {
            kind: "group",
            add: netlify_vsc_commands.add_site,
          },
          async children() {
            const sites = await api.sites()
            return sites.map(_site)
          },
        } as TreeItemBuilder,
        {
          label: "account",
          iconPath: "account",
          children() {
            return [
              {
                label: "payment methods",
                iconPath: "credit-card",
                async children() {
                  const cc = await api.paymentMethods()
                  return cc.map((c) => {
                    return { label: c.treeview_label }
                  })
                },
              },
            ]
          },
        },
      ]
    },
  }
}

function _site(site: NetlifySite) {
  const { custom_domain, admin_url, url } = site
  return {
    label: site.name,
    description: custom_domain ?? "",
    iconPath: "browser",
    children() {
      return iter(function* () {
        if (url) yield link("open site", url)
        if (admin_url) yield link("open admin", admin_url)
        if (!custom_domain) {
          yield {
            label: "add domain...",
            iconPath: "globe",
            tooltip: "register a new domain for this site",
            command: netlify_vsc_commands.register_domain,
          }
        }
        yield {
          label: "deploys",
          iconPath: "versions",
          async children() {
            const deploys = await site.deploys()
            return deploys.map((d) => {
              return {
                label: d.treeview_label,
                //iconPath: d.state === "ready" ? "cloud" : "cloud-upload",
                iconPath: d.treeview_iconPath,
                description: d.treeview_description,
                tooltip: d.treeview_tooltip,
                contextValue: "netlify-deploy-item",
                children() {
                  return [
                    link("open preview", d.ssl_url__or__url),
                    link("open admin", d.admin_url!),
                    {
                      label: "status: " + d.state,
                      iconPath: "circle-outline",
                    },
                    {
                      label: "summary",
                      iconPath: "checklist",
                      children() {
                        const mm = d.raw?.summary?.messages ?? []
                        return mm.map((m) => {
                          return {
                            label: m.title,
                            tooltip: `${m.description}\n${m.details}`,
                          }
                        })
                      },
                    },
                    // {
                    //   label: "build",
                    //   async children() {
                    //     const b = await d.build()
                    //     if (!b) return []
                    //     return [{ label: "build sha", description: b.sha }]
                    //   },
                    // },
                  ]
                },
              }
            })
          },
        } as TreeItemBuilder
        yield {
          label: "forms",
          //iconPath: "whole-word",
          iconPath: "feedback",
          //iconPath: "mail",
        } as TreeItemBuilder
        yield { label: "analytics", iconPath: "graph" }
        yield { label: "large media", iconPath: "file-media" }
        yield { label: "identity", iconPath: "person" }
        yield _site_snippets(site)
        if (site.repo_url) yield _site_develop_locally(site)
      })
    },
  } as TreeItemBuilder
}

function _site_develop_locally(site: NetlifySite) {
  const netlify_dev = {
    label: "netlify dev",
    description: "clone and develop site locally",
    tooltip: "clone repo and use Netlify Dev",
    // iconPath: "file-code",
    iconPath: "remote-explorer",
    // description: site.repo_url,
    // command: command_exec(() => quick_setup(site)),
    command: {
      command: netlify_vsc_commands.develop_locally.command,
      arguments: [site.repo_url],
      title: "Develop Locally",
    },
  }
  return netlify_dev
  return {
    label: "develop locally",
    iconPath: "file-code",
    children() {
      return [netlify_dev]
    },
  } as TreeItemBuilder
}

function quick_setup(site: NetlifySite) {}

function command_exec(f: () => void, title = "") {
  return {
    command: netlify_vsc_commands.exec.command,
    arguments: [f],
    title,
  }
}

function _site_snippets(site: NetlifySite) {
  return {
    label: "snippets",
    iconPath: "code",
    menu: {
      kind: "group",
      add: netlify_vsc_commands.add_snippet,
      doc: {
        command: "vscode.open",
        title: "Open Documentation",
        arguments: [
          "https://docs.netlify.com/site-deploys/post-processing/snippet-injection/",
        ],
      },
      async children() {
        return {
          label: "snippet1 (mock)",
          iconPath: "gist",
        }
      },
    },
  } as TreeItemBuilder
}

function link(label: string, url: string) {
  return {
    label,
    iconPath: "link-external",
    //description: url,
    tooltip: url,
    command: {
      command: "vscode.open",
      arguments: [url],
    },
  } as TreeItemBuilder
}
