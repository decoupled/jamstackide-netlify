import { DefaultFileSystem } from "x/fs/DefaultFileSystem"
import { autowire } from "./autowire"

{
  const project = autowire(
    new DefaultFileSystem(),
    "/Users/aldo/com.github/redwoodjs/example-blog"
  )
  const ff = project.HeadersFile().filePath
  console.log(ff)
  // console.log(new HeadersFile())
  // console.log(new RedirectsFile())
  // console.log(new Project())
  // console.log(new NetlifyTOML())
  // console.log(new DefaultFileSystem())
}
