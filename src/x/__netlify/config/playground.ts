import getNetlifyConfig from "@netlify/config"
import { existsSync, readFileSync } from "fs-extra"
import { join } from "path"
import * as toml from "toml"
import { memo } from "x/decorators"
import { TreeItem2, TreeItemCollapsibleState2 } from "x/vscode"

{
  // const context = 'production'
  // const context = "deploy-preview"
  const context = "feat/branch"
  const cwd = "/Users/aldo/com.github/decoupled/netlify-test-site"
  const res = await getNetlifyConfig({ offline: false, cwd, context })
  console.log(res)
  console.log(res.siteInfo)
}

export function getSuperConfigOutline(cwd: string): TreeItem2 {
  return new ProjectC(cwd).outline()
}

class ProjectC {
  constructor(public cwd: string) {}
  @memo() production(): DeployContext {
    return this.getContext("production")
  }
  @memo() deploy_preview(): DeployContext {
    return this.getContext("deploy-preview")
  }
  @memo() branch_deploy(): DeployContext {
    return this.getContext("branch-deploy")
  }
  @memo() defaultContexts() {
    return [this.production(), this.deploy_preview(), this.branch_deploy()]
  }
  @memo() getContext(name: string) {
    return new DeployContext(this, name)
  }
  @memo() allContexts(): DeployContext[] {
    return Array.from(this.allContextNames()).map((x) => this.getContext(x))
  }
  @memo() allContextNames() {
    const defaultnames = ["production", "deploy-preview", "branch-preview"]
    const xx = this.netlifyTOML()?.contextNames()
    return new Set([...defaultnames, ...xx])
  }
  @memo() netlifyTOML(): NetlifyTOMLWrapper | undefined {
    if (existsSync(this.f("netlify.toml"))) {
      return new NetlifyTOMLWrapper(this)
    }
  }
  @memo() f(x: string) {
    return join(this.cwd, x)
  }

  @memo() outline(): TreeItem2 {
    return {
      label: "Config",
      children: async () => {
        const contexts = [
          ...this.allContexts().map((x) => x.outline()),
          { label: "(+ add context)!!" },
        ]
        return [
          {
            label: "dev",
            children: () => [],
            collapsibleState: TreeItemCollapsibleState2.Collapsed,
          },
          {
            label: "build",
            children: () => [],
            collapsibleState: TreeItemCollapsibleState2.Collapsed,
          },
          {
            label: "context",
            children: () => contexts,
            collapsibleState: TreeItemCollapsibleState2.Expanded,
          },
          {
            label: "functions",
            children: () => [
              {
                label: "directory",
              },
              {
                label: "node_bundler",
              },
              {
                label: "add override...",
              },
            ],
            collapsibleState: TreeItemCollapsibleState2.Collapsed,
          },
          {
            label: "plugins",
            children: () => [],
            collapsibleState: TreeItemCollapsibleState2.Collapsed,
          },
          {
            label: "redirects",
            children: () => [],
            collapsibleState: TreeItemCollapsibleState2.Collapsed,
          },
        ]
      },
    }
  }
}

class NetlifyTOMLWrapper {
  constructor(public project: ProjectC) {}
  @memo() contextNames() {
    const filePath = this.project.f("netlify.toml")
    const data = toml.parse(readFileSync(filePath).toString())
    return Object.keys(data?.context ?? {})
  }
}

function label_desc(
  label: string,
  description: string = "",
  exists: boolean = false
): Pick<TreeItem2, "label" | "description" | "key"> {
  if (exists) return { label: " " + label, description, key: label }
  return { label: "", description: label, key: label }
}

class DeployContext {
  constructor(private project: ProjectC, private context: string) {}
  @memo() isDefinedInNetlifyTOML(): boolean {
    return this.project.netlifyTOML().contextNames().includes(this.context)
  }
  @memo() async resolvedConfig(): Promise<ConfigResult> {
    const r = await getNetlifyConfig({
      context: this.context,
      offline: true,
      cwd: this.project.cwd,
    })
    const r2 = await r
    return new ConfigResult(this, r2)
  }
  @memo() outline(): TreeItem2 {
    const exists = this.isDefinedInNetlifyTOML()

    return {
      ...label_desc(this.context, undefined, exists),
      children: async () => {
        try {
          const rc = await this.resolvedConfig()
          const command = rc.x.config?.build?.command
          return [
            {
              label: "command",
              description: command ?? "<undefined>",
            },
            {
              label: "environment",
              description: "",
            },
          ]
        } catch (e) {
          console.log(e)
          return [{ label: "<error fetching config>", key: "err" }]
        }
      },
    }
  }
}
class ConfigResult {
  constructor(public context: DeployContext, public x: RawData) {}
  @memo() siteInfo(): SiteInfo {
    return new SiteInfo(this.x.siteInfo)
  }
  @memo() env() {
    return new Env(this, this.x.env)
  }
}

class Env {
  constructor(c: ConfigResult, x: any) {}
}

class SiteInfo {
  constructor(x: any) {}
}

type RawData = typeof exampleConfig
const exampleConfig = {
  siteInfo: {},
  env: {
    CONTEXT: {
      sources: ["general"],
      value: "feat/branch",
    },
    BRANCH: {
      sources: ["general"],
      value: "master",
    },
    HEAD: {
      sources: ["general"],
      value: "master",
    },
    COMMIT_REF: {
      sources: ["general"],
      value: "01f12ec5d090960c48daed4895ecae08cb507081",
    },
    PULL_REQUEST: {
      sources: ["general"],
      value: "false",
    },
    LANG: {
      sources: ["general"],
      value: "en_US.UTF-8",
    },
    LANGUAGE: {
      sources: ["general"],
      value: "en_US:en",
    },
    LC_ALL: {
      sources: ["general"],
      value: "en_US.UTF-8",
    },
    GATSBY_TELEMETRY_DISABLED: {
      sources: ["general"],
      value: "1",
    },
    NEXT_TELEMETRY_DISABLED: {
      sources: ["general"],
      value: "1",
    },
  },
  configPath: "/Users/aldo/com.github/decoupled/netlify-test-site/netlify.toml",
  buildDir: "/Users/aldo/com.github/decoupled/netlify-test-site",
  repositoryRoot: "/Users/aldo/com.github/decoupled/netlify-test-site",
  config: {
    functionsDirectory:
      "/Users/aldo/com.github/decoupled/netlify-test-site/netlify/functions",
    functionsDirectoryOrigin: "default",
    dev: {
      targetPort: 4000,
    },
    functions: {
      "*": {},
    },
    plugins: [],
    build: {
      environment: {},
      command: "echo 'special branch'",
      commandOrigin: "config",
      functions:
        "/Users/aldo/com.github/decoupled/netlify-test-site/netlify/functions",
    },
  },
  context: "feat/branch",
  branch: "master",
} as const
