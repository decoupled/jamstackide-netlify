import vscode from "vscode"

/**
 * The Netlify
 */

/**
 *
 */
interface VSCode_to_CLI {
  functions_list_templates(): Promise<{ label: string; id: number }>
  functions_create(): Promise<void>
  // ---
  auth_status(): Promise<{}>
  linked_site_info(dir: string): Promise<{}>
}

/**
 *
 */
interface CLI_to_VSCode {
  /**
   * This is true if the CLI is running within the VSCode terminal
   */
  isActive(): boolean

  /**
   * executes a command
   */
  command(command_id: string, ...args: any[]): Promise<any>
}

// vscode.window.withProgress()
// vscode.window.showInformationMessage()
