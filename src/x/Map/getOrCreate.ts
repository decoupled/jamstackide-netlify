import { NestedMap } from "./NestedMap"

interface MapLike<K, V> {
  get(k: K): V | undefined
  has(k: K): boolean
  set(k: K, v: V): any
}

export const Map_getOrCreate = getOrCreate

export function getOrCreate<K, V>(map: MapLike<K, V>, k: K, f: () => V): V {
  if (!map.has(k)) {
    const v = f()
    map.set(k, v)
    return v
  }
  return map.get(k)!
}

const _pending = new NestedMap<[any, any], Promise<any>>([WeakMap, Map])
export async function getOrCreateAsyncMemoized<K, V>(
  map: MapLike<K, V>,
  k: K,
  f: (k: K) => Promise<V | undefined>
): Promise<V | undefined> {
  if (map.has(k)) return map.get(k)!
  if (_pending.has([map, k])) {
    await _pending.get([map, k])
    return map.get(k)
  } else {
    await fetch()
    return map.get(k)
  }
  async function fetch(): Promise<void> {
    const p = f(k)
    _pending.set([map, k], p)
    const r = await p
    _pending.delete([map, k])
    if (typeof r !== "undefined") map.set(k, r)
  }
}
