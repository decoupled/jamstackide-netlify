export function Array_unique_keep_first<T>(xs: Array<T>): Array<T> {
  const xs2: Array<T> = []
  xs.forEach((x) => {
    if (!xs2.includes(x)) xs2.push(x)
  })
  return xs2
}
