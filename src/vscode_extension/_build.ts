import { emptyDirSync } from "fs-extra"
import { crypto_filenameFriendlyHash } from "src/x/crypto/crypto_filenameFriendlyHash"
import { degit_with_retries } from "src/x/degit/degit_with_retries"
import { netlify_vscode_extension } from "./extension"

{
  // openExtensionOn("git@github.com:redwoodjs/example-blog.git")
  netlify_vscode_extension.dev.buildAndOpen({
    openOnFolder: "/Users/aldo/com.github/redwoodjs/example-blog",
    disableOtherExtensions: true,
  })
}

{
  // openExtensionOn("git@github.com:redwoodjs/example-blog.git")
  netlify_vscode_extension.dev.buildAndOpen({
    openOnFolder: "/Users/aldo/com.github/decoupled/netlify-test-site",
    disableOtherExtensions: true,
  })
}

{
  netlify_vscode_extension.dev.buildPackageAndShowOutput()
}

async function openExtensionOn(gitURL: string) {
  const dir = `/tmp/test-projects/${crypto_filenameFriendlyHash(gitURL)}`
  emptyDirSync(dir)
  await degit_with_retries(gitURL, dir)
  netlify_vscode_extension.dev.buildAndOpen({
    openOnFolder: dir,
    disableOtherExtensions: true,
  })
}
