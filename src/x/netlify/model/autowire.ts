import { autowire__impl } from "./autowire_impl"
import { IFileSystem } from "x/fs/IFileSystem"
import { Project } from "./Project"
import { ProjectRoot } from "./ProjectRoot"

export function autowire(fs: IFileSystem, r: ProjectRoot): Project {
  return autowire__impl(fs, r)
}

// /**
//  * @provides
//  * @singleton
//  */
// export function getFileSystem(): IFileSystem {
//   return new DefaultFileSystem()
// }
