import { crypto_filenameFriendlyHash } from "@decoupled/xlib"
import { emptyDirSync } from "fs-extra"
import { VSCE_TOKEN } from "src/secrets"
import { degit_with_retries } from "x/degit/degit_with_retries"
import { extension } from "./extension"
import { join } from "path"

{
  1 + 25
}

{
  extension.dev.publish({ marketplaceAuthToken: VSCE_TOKEN })
}

{
  // openExtensionOn("git@github.com:redwoodjs/example-blog.git")
  extension.dev.buildAndOpen({
    openOnFolder: "/Users/aldo/com.github/redwoodjs/example-blog",
    disableOtherExtensions: false,
    watchAndReloadLanguageServer: true,
  })
}

{
  extension.dev.buildAndOpen({
    openOnFolder: "/Users/aldo/com.github/decoupled/netlify-test-site",
    disableOtherExtensions: false,
    watchAndReloadLanguageServer: true,
  })
}

{
  openExample("debugging/static_html__js__js_functions")
}

// /Users/aldo/com.github/decoupled/netlify-vscode-extension/example-projects/netlify-functions-basic-1

export function buildAndPublish() {
  extension.dev.buildPackageAndShowOutput()
}

{
  extension.dev.buildPackageAndShowOutput()
}

function openExample(example: string) {
  extension.dev.buildAndOpen({
    openOnFolder: join(__dirname, "../../example_projects", example),
    disableOtherExtensions: false,
    watchAndReloadLanguageServer: false,
  })
}

async function openExtensionOn(gitURL: string) {
  const dir = `/tmp/test-projects/${crypto_filenameFriendlyHash(gitURL)}`
  emptyDirSync(dir)
  await degit_with_retries(gitURL, dir)
  extension.dev.buildAndOpen({
    openOnFolder: dir,
    disableOtherExtensions: true,
  })
}
