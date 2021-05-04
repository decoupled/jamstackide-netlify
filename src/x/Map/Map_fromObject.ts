type Key = string | number | symbol
export function Map_fromObject<K extends Key, V>(obj: Record<K, V>): Map<K, V>
export function Map_fromObject(
  obj: object
): Map<string | number | symbol, any> {
  if (typeof Object.entries === "function") return new Map(Object.entries(obj))
  return new Map(Object.keys(obj).map(k => [k, obj[k]]) as any)
}
