import vscode from "vscode"
export function netlify_vsc_statusbar(ctx: vscode.ExtensionContext) {
  return
  const si = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  )
  si.text = "$(sync~spin) Deploying to Netlify..."
  // si.command = "_redwoodjs.show_new_version_message"
  si.show()
  ctx.subscriptions.push(si)
  return si
}
