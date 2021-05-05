import { values } from "lodash"
import { join } from "path"
import { memo } from "src/x/decorators"
import { netlify_events_meta } from "src/x/netlify/events/netlify_events_meta"
import vscode from "vscode"

export function commands_create_function(ctx: vscode.ExtensionContext) {
  vscode.commands.registerCommand(
    commands.create_function.command,
    () => {
      const frb = new CreateFunctionWizard()
      frb.start()
      // Trigger: Command : Netlify > Add a new function
      // Pick a function directory, if not already configured
      // Pick a language (JavaScript, TypeScript, Go)
      // Pick a type (synchronous, background, event)
      // If event, pick a type and configuration
      // If sync or background, pick from a template
      // Provide a name
      // Auto-populate the directory with the template file
    },
    ctx.subscriptions
  )
}

// functions context menu: show log
// https://docs.netlify.com/functions/logs/

// https://docs.netlify.com/functions/overview/
class CreateFunctionWizard {
  constructor() {}
  async start() {
    try {
      const name = await this.functionName()
      const functionsDir = await this.functionsDir()
      const ff = join(functionsDir, name)
      const newFiles = new Map<string, string>([[ff, "function foo(){}"]])
      vscode.window.showInformationMessage(`create function ${name}`)
    } catch (e) {
      if (e !== breakIfNull_Error) throw e
    }
  }
  @memo() async functionLanguage(): Promise<string | undefined> {
    return (
      await vscode.window.showQuickPick(
        [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
          { label: "Go", value: "go" },
        ],
        { placeHolder: "Pick Function Language" }
      )
    ).value
  }
  @memo() async functionType(): Promise<string | undefined> {
    return (
      await vscode.window.showQuickPick(
        [
          {
            value: "sync",
            label: "$(circuit-board) Serverless Function",
            detail: "Run server-side code",
            // 10 second execution limit for synchronous serverless functions
          },
          {
            value: "background",
            label: "$(clock) Background Function",
            detail: "Execute long-running processes (<15 minutes)",
          },
          {
            value: "event",
            label: "$(zap) Event Handler Function",
            detail:
              "Triggered by events (ex: identity-signup, deploy-succeeded)",
          },
        ],
        {
          placeHolder: "Pick Function Type",
        }
      )
    ).value
  }
  @memo() async eventType(): Promise<string | undefined> {
    return (
      await vscode.window.showQuickPick(eventTypeItems(), {
        placeHolder: "Pick Event Type",
      })
    )?.value
  }
  @memo() async functionName(): Promise<string | undefined> {
    const lang = breakIfNull(await this.functionLanguage())
    let postfix = `.${lang}`

    const functionType = breakIfNull(await this.functionType())
    if (functionType === "event") {
      // event triggers have a fixed name
      return breakIfNull(await this.eventType()) + postfix
    }

    if (functionType === "background") postfix = "-background" + postfix

    const name = await new Promise<string | undefined>((resolve, reject) => {
      // get name
      const ib = vscode.window.createInputBox()
      ib.title = "Pick Function Name"
      let okValue: string | undefined
      ib.onDidChangeValue((v) => {
        ib.validationMessage = ""
        try {
          validateFunctionName(v)
          ib.prompt = v + postfix
          okValue = v + postfix
        } catch (e) {
          okValue = undefined
          ib.validationMessage = e.toString()
        }
      })
      ib.onDidAccept(() => {
        resolve(okValue)
      })
      ib.onDidHide(() => resolve(undefined))
      ib.show()
    })

    return name

    function validateFunctionName(x: string) {
      if (x.length < 3) throw new Error("longer name plz")
    }
  }
  @memo() async functionsDir(): Promise<string> {
    return "/tmp/foo"
  }
}

function createTypeScriptFunction() {
  const ccc = `
  import { Handler } from "@netlify/functions";

  const handler: Handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello World" }),
    };
  };
  
  export { handler };  
  `
}

const commands = {
  create_function: {
    command: "netlify.create_function",
    title: "Create Function...",
    category: "Netlify",
  },
}

export function commands_create_function_contributes() {
  return {
    contributes: {
      commands: [...values(commands)],
    },
  } as const
}

/*
Add a new function

[P0] Configure netlify.toml 

Trigger: right-click anywhere in the netlify.toml file
Options: 
“Add a redirect” 
“Add a new context” 
“Add a custom header” 
“Add an edge handler” 

Based on the chosen option, populate the template properties into the netlify.toml configuration file in the current workspace. 

*/

const breakIfNull_Error = new Error("break")
function breakIfNull<T>(x: T): NonNullable<T> {
  if (typeof x === "undefined" || x === null) throw breakIfNull_Error
  return x as any
}

export function eventTypeItems() {
  return Object.keys(netlify_events_meta)
    .sort()
    .map((id) => ({
      label: `$(zap) ${id}`,
      value: id,
      detail: netlify_events_meta[id].doc,
    }))
}
