import { emptyDirSync } from "fs-extra"
import { crypto_filenameFriendlyHash } from "src/x/crypto/crypto_filenameFriendlyHash"
import { degit_with_retries } from "src/x/degit/degit_with_retries"
import { netlify_vscode_extension_build_target as extension } from "./extension"

{
  const x = 88
  console.log(x)
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
