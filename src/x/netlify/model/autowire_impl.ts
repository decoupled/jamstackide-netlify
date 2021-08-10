import { Project } from "./Project"
import { NetlifyTOML } from "./NetlifyTOML"
import { RedirectsFile } from "./RedirectsFile"
import { HeadersFile } from "./HeadersFile"

export const autowire__impl = ___autowire__(
  "Project",
  ["IFileSystem", "ProjectRoot"],
  [
    {
      out: "Project",
      isConstructor: true,
      isSingleton: false,
      args: [
        "ProjectRoot",
        "IFileSystem",
        { type: "NetlifyTOML", overrides: ["FilePath"] },
        { type: "RedirectsFile", overrides: ["FilePath"] },
        { type: "HeadersFile", overrides: ["FilePath"] },
      ],
      impl: Project,
    },
    {
      out: "NetlifyTOML",
      isConstructor: true,
      isSingleton: false,
      args: ["FilePath", "IFileSystem"],
      impl: NetlifyTOML,
    },
    {
      out: "RedirectsFile",
      isConstructor: true,
      isSingleton: false,
      args: ["FilePath", "IFileSystem"],
      impl: RedirectsFile,
    },
    {
      out: "HeadersFile",
      isConstructor: true,
      isSingleton: false,
      args: ["FilePath", "IFileSystem"],
      impl: HeadersFile,
    },
  ]
)

function ___autowire__(t, o, rules) {
  type TypeID = any
  type RuleDef = any
  class Ctx {
    constructor(
      private rules: RuleDef[],
      private overrides = new Map<TypeID, any>(),
      private parent?: Ctx
    ) {}
    cache = new Map<TypeID, any>()
    solve(t: TypeID) {
      if (this.overrides.has(t)) return this.overrides.get(t)
      if (this.parent) return this.parent.solve(t)
      const r = this.rules.find(({ out }) => out === t)
      if (!r) throw new Error("Autowire type not found: " + t)
      if (r.isSingleton)
        if (Ctx.singletonCache.has(t)) return Ctx.singletonCache.get(t)

      const args = (r.args ?? []).map((arg) => {
        if (arg === "undefined") return undefined
        if (typeof arg === "object")
          return this.createFactory(arg.type, arg.overrides)
        return this.solve(arg)
      })
      const v = r.isConstructor ? new r.impl(...args) : r.impl(...args)
      if (r.isSingleton) Ctx.singletonCache.set(t, v)
      return v
    }
    createFactory(t: TypeID, overrideTypes: TypeID[]) {
      return (...args: any[]) => {
        const overrides2 = new Map(this.overrides)
        for (const [i, ot] of overrideTypes.entries())
          overrides2.set(ot, args[i])
        const ctx2 = new Ctx(this.rules, overrides2)
        return ctx2.solve(t)
      }
    }
    private static singletonCache = new Map<TypeID, any>()
  }
  return new Ctx(rules).createFactory(t, o)
}
