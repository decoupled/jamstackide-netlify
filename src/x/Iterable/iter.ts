export function iter<T>(x: Iterable<T> | (() => Iterable<T>)): T[] {
  if (typeof x === "function") return iter(x())
  return Array.from(x)
}
