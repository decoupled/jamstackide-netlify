import { netlify_redirect_parser_from_source } from "./netlify_redirect_parser"

class NetlifyRedirectsFile {
  constructor(public src: string) {}
}

{
  const r = await netlify_redirect_parser_from_source(
    `
    /path param1=:value1 param2=:value2 /otherpath/:value1/:value2/:splat 301
    
    `
  )
  console.log(r)
}
