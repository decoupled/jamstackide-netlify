/**
 * TODO: rewrite into something more elegant. maybe allow for bfs/dfs
 * @param root
 * @param includeRoot
 */
export function* Object_iterateAllReachableObjectsAndArrays(
  root: object,
  includeRoot: boolean = true
) {
  const seen = new Set<any>()
  yield* iter(root)
  function* iter(node: any) {
    if (typeof node !== "object") return
    if (seen.has(node)) return
    seen.add(node)
    let include = true
    if (!includeRoot && root === node) include = false
    if (include) yield node
    if (Array.isArray(node)) {
      for (const vv of node) yield* iter(vv)
    } else {
      for (const key of Object.keys(node)) yield* iter(node[key])
    }
  }
}
