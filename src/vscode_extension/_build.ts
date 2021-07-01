import { crypto_filenameFriendlyHash } from "@decoupled/xlib"
import { emptyDirSync } from "fs-extra"
import { VSCE_TOKEN } from "src/secrets"
import { degit_with_retries } from "x/degit/degit_with_retries"
import { netlify_vscode_extension_build_target as extension } from "./extension"

{
  1 + 9
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
  extension.dev.buildPackageAndShowOutput()
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
