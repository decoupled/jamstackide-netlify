import { Taplo } from "@taplo/lib"

async function testt() {
  const toml = await Taplo.initialize()
  console.log(typeof toml)
  const r = await toml.format(`   [lib]  `)
  console.log(r)
  // const formatted = toml.format("   [lib]   ")
  // console.assert(formatted === "[lib]\n")
  const obj = await toml.decode("key = true")

  console.log(obj)
}

{
  testt()
}
