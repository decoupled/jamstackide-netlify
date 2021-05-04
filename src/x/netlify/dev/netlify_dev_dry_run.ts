import { ResolvedNetlifyDevSettings } from "./types"
import execa from "execa"

export async function netlify_dev_dry_settings(
  dir: string
): Promise<ResolvedNetlifyDevSettings | undefined> {
  const collected = await netlify_dev_dry(dir)
  for (const c of collected) if (c.type === "settings") return c.data
}

async function netlify_dev_dry(dir: string) {
  // this requires @decoupled/netlify-cli@2.59.1-alpha.3 to be installed globally
  //const netlify_2 = "/Users/aldo/com.github/decoupled/netlify-cli/bin/run"
  const netlify_2 = "decoupled-netlify"
  const dev_dry = `${netlify_2} dev --xdry`
  const cwd = dir
  const [cmd, ...args] = dev_dry.split(" ")
  const res = await execa(cmd, args, { cwd })
  if (res.exitCode === 1) {
  }
  const collected: any[] = []
  const parts = res.stdout.split(start_delim)
  for (const part of parts) {
    if (part.includes(end_delim)) {
      const pp = part.split(end_delim)
      collected.push(JSON.parse(pp[0]))
    }
  }
  collected //?
  return collected
}

// these are copy pasted into the "hacked" netlify-cli
const start_delim = "----start-----decoupled-delimiter----78978978e979---2----"
const end_delim = "----end-----decoupled-delimiter----78978978e979---2----"

interface DetectionOutput {
  netlifyDev?: NetlifyDevDetectionOutput
}

interface NetlifyDevDetectionOutput {}
