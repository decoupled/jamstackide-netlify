type UndefOr<T> = T | undefined | null | void

export type ArrayLike<T> =
  | Array<UndefOr<T>>
  | Promise<UndefOr<T>>
  | Promise<Array<UndefOr<T>>>
  | Iterable<UndefOr<T>>
  | AsyncIterable<UndefOr<T>>
  | null
  | undefined
  | void

export function ArrayLike_normalize<T>(x: ArrayLike<T>): Promise<T[]> {
  return unwrap(x)
}

type Unbox<T> = T extends Promise<infer A>
  ? Unbox<A>
  : T extends Array<infer B>
  ? Unbox<B>
  : T extends Iterable<infer C>
  ? Unbox<C>
  : T extends AsyncIterable<infer D>
  ? Unbox<D>
  : T

type UnboxerFunction = <T>(x: T) => Promise<Array<Unbox<T>>>

async function unwrap(v: any) {
  // terminal cases
  if (!isDefined(v)) return []
  if (typeof v !== "object") return [v]
  if (Array.isArray(v)) return v.filter(isDefined)
  // recursion
  //   --> promise
  if (typeof v.then === "function") return await unwrap(await v)
  //   --> iterable
  const r = await tryIterate(v)
  if (typeof r === "undefined") return [r] // terminal
  return r
}

// we use a brute force approach
// instead of checking for Symbol.asyncIterator et al
// so we can down-compile
async function tryIterate(xs: any): Promise<Array<any> | undefined> {
  const res: any[] = []
  try {
    for await (const x of xs) {
      if (isDefined(x)) res.push(x)
    }
    return res
  } catch (e) {}
}

{
  ArrayLike_normalize(["a", "b"])
  ArrayLike_normalize(iter1())
  ArrayLike_normalize(iter2())
  ArrayLike_normalize(bloof())
}

async function* iter1() {
  yield "c"
  yield "d"
}
function* iter2() {
  yield "e"
  yield "f"
}
async function bloof() {
  return "bloof"
}

function isDefined(x: any): boolean {
  if (typeof x === "undefined") return false
  if (x === null) return false
  return true
}
