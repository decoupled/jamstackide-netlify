import _ from "lodash"
import * as mobx from "mobx"
import * as mobxUtil from "mobx-utils"
import { getOrCreate } from "x/Map/getOrCreate"

/**
 * suspends and waits for expr() to be ready
 * @param expr
 */
export function await_<T>(expr: () => Promise<T>): T {
  const c = _.last(Computation.stack)
  if (!c) throw new Error("Trying to call wait() outside of a context")
  return c.await_(expr)
}

/**
 * suspends. use this only if this if/else branch depends on
 * a reactive value (so it will eventually go the other way)
 */
export function await__(): never {
  throw new Wait()
}

export function awaitOr<T>(f: () => T): T {
  if (canAwait()) await__()
  return f()
}

export function toObservableValue<T, P>(
  block: () => T,
  initialValue: P
): mobx.IObservableValue<T | typeof initialValue> {
  return new Computation(block, initialValue).box
}

export function canAwait(): boolean {
  return Computation.stack.length > 0
}

class Wait extends Error {
  constructor() {
    super("Wait")
  }
}

class Computation<T, P> {
  static stack: Computation<any, any>[] = []

  private exprCount = 0

  private cache = new Map<number, mobxUtil.IPromiseBasedObservable<any>>()

  box = mobx.observable.box<T | P>()

  constructor(private block: () => T, initialValue: P) {
    this.box = mobx.observable.box<T | P>(initialValue)
    //this.iter()
    mobx.autorun(() => this.iter())
  }

  private iter() {
    Computation.stack.push(this)
    try {
      this.exprCount = 0
      const result = this.block()
      this.cache.clear() // TODO: this is not the only way to think about lifespan
      this.box.set(result)
    } catch (e) {
      if (e instanceof Wait) {
        //this.box.set(this.initialValue)
      }
    } finally {
      Computation.stack.pop()
    }
  }

  await_<U>(expr: () => Promise<U>): U {
    const index = this.exprCount++
    const op = getOrCreate(this.cache, index, () =>
      mobxUtil.fromPromise(expr())
    )
    return op.case({
      fulfilled: (t) => t,
      rejected: (e) => {
        throw e
      },
      pending: () => {
        throw new Wait()
      },
    })
  }
}
