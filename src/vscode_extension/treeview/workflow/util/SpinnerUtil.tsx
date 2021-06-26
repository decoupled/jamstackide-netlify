import { memoize, repeat } from "lodash"
import { computed, makeObservable } from "mobx"
import { now } from "mobx-utils"

export class SpinnerUtil {
  private constructor() {
    makeObservable(this)
  }
  private _num = 0
  get num() {
    now(300)
    return this._num++
  }
  @computed get dots() {
    const n = this.num % 4
    return repeat(".", n) + repeat(" ", 3 - n)
  }
  private spinner_text = "◐◓◑◒"
  private spinner_text_ = "▖▘▝▗"
  @computed get spinner() {
    const n = this.num % this.spinner_text.length
    return this.spinner_text[n]
  }
  private static instance = memoize(() => new SpinnerUtil())
  static dots() {
    return this.instance().dots
  }
  static spinner() {
    return this.instance().spinner
  }
  static num() {
    return this.instance().num
  }
}
