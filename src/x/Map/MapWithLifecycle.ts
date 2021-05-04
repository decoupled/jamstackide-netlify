export class MapWithLifecycle<K, V> {
  constructor(
    private opts: { create: (k: K) => V; dispose?: (v: V) => void }
  ) {}
  items: Map<K, V> = new Map()
  async update(newKeys: Iterable<K>) {
    const newKeys_ = new Set(newKeys)
    for (const [k, v] of this.items.entries())
      if (!newKeys_.has(k)) {
        this.items.delete(k)
        this.opts.dispose?.(v)
      }
    for (const k of newKeys)
      if (!this.items.has(k)) this.items.set(k, this.opts.create(k))
  }
}
