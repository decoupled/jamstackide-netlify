import * as nrp from "netlify-redirect-parser"

{
  const res = await nrp.parseRedirectsFormat(
    "/Users/aldo/com.github/decoupled/netlify-vscode-extension/src/x/_playgrounds/netlify_redirect_files/a2"
  )
  console.log(res.success)
}

{
  const x = 88
  const z = x + 10
  console.log(z)
}
