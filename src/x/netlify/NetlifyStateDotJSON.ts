import { lazy } from "x/decorators"
import { isEqual } from "lodash"
import { join } from "path"
import { readJSONSync, outputJSONSync } from "fs-extra"

/**
 * Wrapper for .netlify/state.json
 */
export class NetlifyStateDotJSON {
  private constructor(public dir: string) {}
  @lazy() get filePath() {
    return join(this.dir, ".netlify/state.json")
  }
  get data() {
    try {
      return readJSONSync(this.filePath)
    } catch (e) {}
  }
  get siteId(): string | undefined {
    return this.data?.siteId
  }
  setData(newData = {}) {
    const oldData = this.data ?? {}
    if (isEqual(newData, oldData)) return
    outputJSONSync(this.filePath, newData)
  }
  setSiteId(v: string | undefined) {
    const data = { ...(this.data ?? {}) }
    if (typeof v === "string") {
      data.siteId = v
    } else {
      delete data.siteId
    }
    this.setData(data)
  }
  static forDir(dir: string) {
    return new NetlifyStateDotJSON(dir)
  }
}
