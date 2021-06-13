import vscode from "vscode"
import {
  NewProjectSourceSpec,
  NewProjectSourceSpec_parse,
} from "./NewProjectSourceSpec"

export async function NewProjectSourceSpec_prompt(): Promise<
  NewProjectSourceSpec | undefined
> {
  const v = await vscode.window.showInputBox({
    prompt:
      "Git Repo URL, Git repo name (netlify-templates/next-starter-jamstack), yarn/npm create template (create-react-app)",
    validateInput(x: string) {
      try {
        NewProjectSourceSpec_parse(x)
      } catch (e) {
        return "invalid value: " + e
      }
    },
  })
  if (typeof v === "undefined") return undefined
  return NewProjectSourceSpec_parse(v)
}
