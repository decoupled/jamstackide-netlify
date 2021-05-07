import vscode from "vscode"

export function vscode_QuickPick_await<T extends vscode.QuickPickItem>(
  q: vscode.QuickPick<T>
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const s1 = q.onDidAccept((e) => {
      resolve(q.selectedItems[0])
      dispose()
    })
    const s2 = q.onDidHide(() => {
      resolve(undefined)
      dispose()
    })
    function dispose() {
      s1.dispose()
      s2.dispose()
    }
  })
}
