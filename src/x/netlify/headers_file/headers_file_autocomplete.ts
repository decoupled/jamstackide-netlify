import * as vscode from "vscode"
import { lazy, memo } from "@decoupled/xlib"
import { HeadersFile, Comment, Path, Header } from "./headers_file_parser"

class HeadersFileCompletionsBuilder {
  constructor(
    public document: vscode.TextDocument,
    public position: vscode.Position,
    public token: vscode.CancellationToken,
    public context: vscode.CompletionContext
  ) {}

  @lazy() get parsed() {
    return new HeadersFile(this.document.getText())
  }

  @lazy() get linePrefix(): string {
    const linePrefix = this.document
      .lineAt(this.position)
      .text.substr(0, this.position.character)
    // if (!linePrefix.endsWith("console.")) {
    //   return undefined
    // }
    return linePrefix
  }

  *getCompletions() {
    // where are we?
    const parsedLine = this.parsed.lines[this.position.line]
    if (!parsedLine) return undefined
    const { content } = parsedLine
    if (content instanceof Comment) {
      // no autocompletions in comments
      return
    }
    if (!content) {
      // top level, blank line?
      // header names
      yield* this.completionsForHeaderNames()
      return
    }

    if (content instanceof Path) {
      // no completions for paths?
      return
    }

    if (content instanceof Header) {
      // if we're after the :, provide values
      if (typeof content.headerValueTrimmedText === "undefined") {
        const headerName = content.headerNameTrimmedText.toLowerCase()
        if (headerName === "cache-control") {
          yield cache_control__max_age()
          for (const opt of cache_control_opts) {
            const cc = new vscode.CompletionItem(opt)
            cc.insertText = opt
            yield cc
          }
        }
      }
    }
  }

  private *completionsForHeaderNames() {
    function x_frame_options_deny() {
      const cc = new vscode.CompletionItem("X-Frame-Options: DENY")
      cc.insertText = "X-Frame-Options: DENY"
      cc.documentation =
        "The page cannot be displayed in a frame, regardless of the site attempting to do so."
      return cc
    }
    yield x_frame_options_deny()

    function x_frame_options_sameorigin() {
      const cc = new vscode.CompletionItem("X-Frame-Options: SAMEORIGIN")
      cc.insertText = "X-Frame-Options: SAMEORIGIN"
      cc.documentation = `The page can only be displayed in a frame on the same origin as the page itself. The spec leaves it up to browser vendors to decide whether this option applies to the top level, the parent, or the whole chain, although it is argued that the option is not very useful unless all ancestors are also in the same origin (see bug 725490). Also see Browser compatibility for support details.`
      return cc
    }

    yield x_frame_options_sameorigin()

    function x_cache_control() {
      const cc = new vscode.CompletionItem("cache-control: ...")
      cc.insertText = "cache-control: "
      cc.documentation = `
          The Cache-Control HTTP header holds directives (instructions) for caching in both requests and responses.
          A given directive in a request does not mean the same directive should be in the response.`
      cc.command = {
        command: "editor.action.triggerSuggest",
        title: "Re-trigger completions...",
      }
      return cc
    }

    yield x_cache_control()
  }
}

function cache_control__max_age() {
  const cc = new vscode.CompletionItem("max-age=<seconds>")
  cc.insertText = new vscode.SnippetString("max-age=${seconds:86400}")
  return cc
}

//
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#cache_response_directives
const cache_control_opts = `
      must-revalidate
      no-cache
      no-store
      no-transform
      public
      private
      proxy-revalidate
      s-maxage=<seconds>
      `
  .split("\n")
  .map((x) => x.trim())
  .filter((x) => x.length > 0)

export function headers_file_autocomplete(context: vscode.ExtensionContext) {
  const provider1 = vscode.languages.registerCompletionItemProvider(
    { pattern: "**/_headers" },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ) {
        const cc = new HeadersFileCompletionsBuilder(
          document,
          position,
          token,
          context
        )
        return Array.from(cc.getCompletions())
        // a completion item that inserts its text as snippet,
        // the `insertText`-property is a `SnippetString` which will be
        // honored by the editor.
        // const snippetCompletion = new vscode.CompletionItem(
        //   "Good part of the day"
        // )
        // snippetCompletion.insertText = new vscode.SnippetString(
        //   "Good ${1|morning,afternoon,evening|}. It is ${1}, right?"
        // )
        // snippetCompletion.documentation = new vscode.MarkdownString(
        //   "Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting."
        // )

        // a completion item that can be accepted by a commit character,
        // the `commitCharacters`-property is set which means that the completion will
        // be inserted and then the character will be typed.
        // const commitCharacterCompletion = new vscode.CompletionItem("console")
        // commitCharacterCompletion.commitCharacters = ["."]
        // commitCharacterCompletion.documentation = new vscode.MarkdownString(
        //   "Press `.` to get `console.`"
        // )

        // a completion item that retriggers IntelliSense when being accepted,
        // the `command`-property is set which the editor will execute after
        // completion has been inserted. Also, the `insertText` is set so that
        // a space is inserted after `new`
        // const commandCompletion = new vscode.CompletionItem("new")
        // commandCompletion.kind = vscode.CompletionItemKind.Keyword
        // commandCompletion.insertText = "new "
        // commandCompletion.command = {
        //   command: "editor.action.triggerSuggest",
        //   title: "Re-trigger completions...",
        // }

        // const headers = commonHeaders.map((h) => {
        //   const cc = new vscode.CompletionItem(h)
        //   cc.insertText = h + ": "
        //   cc.command = {
        //     command: "editor.action.triggerSuggest",
        //     title: "Re-trigger completions...",
        //   }
        //   return cc
        // })

        // return all completion items as array
        // return [
        //   // simpleCompletion,
        //   // snippetCompletion,
        //   // commitCharacterCompletion,
        //   // commandCompletion,
        //   ...headers,
        //   x_frame_options_deny(),
        //   x_frame_options_sameorigin(),
        // ]
      },
    }
    // ""
  )

  context.subscriptions.push(provider1)
}
