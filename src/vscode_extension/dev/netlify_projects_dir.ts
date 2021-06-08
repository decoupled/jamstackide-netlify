import os from "os"
import { join } from "path"

export function netlify_projects_dir() {
  return join(os.homedir(), "netlify-vscode-projects")
}
