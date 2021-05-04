export function Map_mapValues<K, V, V2>(
  m: Map<K, V>,
  f: (v: V) => V2
): Map<K, V2> {
  return new Map(Array.from(m.entries()).map(([k, v]) => [k, f(v)]))
}
