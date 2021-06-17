import { crypto_filenameFriendlyHash } from "@decoupled/xlib"
import execa from "execa"
import { pathExists } from "fs-extra"
import { memoize } from "lodash"
import { join } from "path"
import vscode from "vscode"
import { degit_with_retries } from "x/degit/degit_with_retries"
//https://github.com/decoupled/netlify-cli/tree/aldonline-ide-features

// const repo = "decoupled/netlify-cli#aldonline-ide-features"

const hash1 = "2e1b1388730dab07b45a2e5d0b11a6262824ec9d"
const hash2 = "366964f9e87df215b84c472f3c5a1b5c2c43c4a1"
const repo = `decoupled/netlify-cli#${hash2}`
{
  const rr = await netlify_cli_modified_install_2(
    repo,
    "/Users/aldo/com.github/decoupled/netlify-vscode-extension/.tmp"
  )
  console.log(rr)
}

export async function netlify_cli_modified_install_vscode(
  ctx: vscode.ExtensionContext
) {
  crypto_filenameFriendlyHash(repo)
  const pp = ctx.globalStorageUri.fsPath
  const dir = join(pp, "netlify-cli-modified")
  return await netlify_cli_modified_install_2(repo, dir)
}

async function netlify_cli_modified_install_2(
  repo_with_commit_hash: string,
  workDir: string
): Promise<string> {
  const dir = join(
    workDir,
    "netlify-cli-modified-versions",
    crypto_filenameFriendlyHash(repo_with_commit_hash)
  )
  await degit_and_npm_i_memo(repo_with_commit_hash, dir)
  return dir
}

const degit_and_npm_i_memo = memoize(degit_and_npm_i)

async function degit_and_npm_i(repo: string, dir: string) {
  if (await pathExists(dir)) return
  await degit_with_retries(repo, dir)
  await execa("npm", ["i", "--production"], { cwd: dir })
}
