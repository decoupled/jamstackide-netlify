import * as mobx from "mobx"

/**
 * Note: if this map contains a weakmap at some point,
 * only delete, get, has and set will work.
 * the rest will throw errors
 */
export class NestedMap<K extends any[], V> implements Map<K, V> {
  private root: Map<any, any>
  private mcs
  public readonly keysLength: number
  constructor(constructors: any[]) {
    if (constructors.length === 0) throw `expected at least one map constructor`
    this.keysLength = constructors.length
    const [firstC, ...restC] = constructors
    this.root = new firstC()
    this.mcs = restC
  }
  get(keys: K): V | undefined {
    this.checkLength(keys)
    return getNested(this.root, keys)
  }
  getBranch(partialKeys) {
    // TODO: type (we need ts 3.4 for this?)
    return getNested(this.root, partialKeys, undefined)
  }
  has(keys: K): boolean {
    this.checkLength(keys)
    return getNested(this.root, keys, NotFound) !== NotFound
  }
  hasBranch(partialKeys) {
    // TODO: type (we need ts 3.4 for this?)
    const NOT_FOUND = {}
    return getNested(this.root, partialKeys, NOT_FOUND) !== NOT_FOUND
  }

  @mobx.action
  set(keys: K, v: V): this {
    this.checkLength(keys)
    setNested(this.root, keys, v, this.mcs)
    return this
  }
  @mobx.action
  clear(): void {
    this.root.clear()
  }
  @mobx.action
  delete(keys: K): boolean {
    this.checkLength(keys)
    if (!this.has(keys)) return false
    keys = keys.concat() as any
    const last = keys.pop()
    const m = getNested(this.root, keys) as Map<any, any>
    m.delete(last)
    if (m.size === 0) {
      //gc - remove leaf map if empty
      if (keys.length > 0) {
        const last2 = keys.pop()
        const m2 = getNested(this.root, keys)
        m2.delete(last2)
      }
    }
    return true
  }

  deleteBranch(partialKeys: any[]): boolean {
    partialKeys = partialKeys.concat()
    const last = partialKeys.pop()
    const m = getNested(this.root, partialKeys)
    return m.delete(last)
  }

  get size(): number {
    return iter(this.root, this.keysLength)
    function iter(m: Map<any, any>, n: number): number {
      if (n === 1) return m.size
      if (m.size === 0) return 0
      return Array.from(m.values())
        .map(mm => iter(mm, n - 1))
        .reduce((a, b) => a + b)
    }
  }

  *entries(keys: string[] = []): IterableIterator<[K, V]> {
    const { keysLength } = this
    const root = getNested(this.root, keys)
    yield* iter(root, keys)
    function* iter(m, path: string[]) {
      if (path.length === keysLength) yield [path, m]
      else for (const [k, v] of m.entries()) yield* iter(v, path.concat(k))
    }
  }

  *keys(): IterableIterator<K> {
    for (const e of this.entries()) yield e[0]
  }

  *values(): IterableIterator<V> {
    for (const e of this.entries()) yield e[1]
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void {
    for (const [k, v] of this.entries()) callbackfn.apply(thisArg, [v, k, this])
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries()
  }

  get [Symbol.toStringTag]() {
    return "NestedMap()"
  }

  private checkLength(keys: K) {
    if (keys.length !== this.keysLength) throw `wrong number of keys`
  }

  @mobx.action
  mergeJSON(json, atPath: any[] = []) {
    for (const [k, v] of flattenJSON(json, this.keysLength - atPath.length))
      this.set([...atPath, ...k] as any, v)
  }
}

function* flattenJSON(
  json: any,
  depth: number
): IterableIterator<[(string | number)[], any]> {
  yield* iter(json, [])
  function* iter(x: any, path: (string | number)[]) {
    if (path.length === depth) yield [path, x]
    else {
      if (typeof x === "object" && x !== null) {
        if (Array.isArray(x))
          for (const [i, v] of x.entries()) yield* iter(v, path.concat(i))
        else for (const k of Object.keys(x)) yield* iter(x[k], path.concat(k))
      }
    }
  }
}

export function getNested(map, keys: any[], defaultValue?: any) {
  if (keys.length === 0) return map
  let [first, ...rest] = keys
  if (!map.has(first)) return defaultValue
  return getNested(map.get(first), rest, defaultValue)
}

export function setNested(
  map,
  keys: any[],
  v: any,
  mapConstructors?: any[]
): void {
  const mcs = mapConstructors
  if (!Array.isArray(mcs)) return setNested(map, keys, v, keys.map(k => Map))
  const [first, ...rest] = keys
  if (rest.length === 0) {
    map.set(first, v)
    return
  }
  // otherwise, create new map and recursion
  const [firstC, ...restC] = mcs
  if (!map.has(first)) map.set(first, new firstC())
  return setNested(map.get(first), rest, v, restC)
}

const NotFound = Symbol()
