import { NewProjectSourceSpecString } from "../util/NewProjectSourceSpec"

export type DevelopLocallyOpts =
  | FromMagicURL
  | InitAfterReload
  | FromCommandInvocation
  | FromNetlifyExplorer

export interface FromMagicURL {
  action: "FromMagicURL"
  source?: NewProjectSourceSpecString
  extraOpts?: ExtraOpts
}

export interface ExtraOpts {
  /**
   * relative path to a file to open upon launching
   */
  open?: string
  /**
   * override netlify-dev framework
   */
  framework?: string
  /**
   * provide a command run start dev
   * TODO: prompt user for authorization
   */
  command?: string
  /**
   * override the install command
   * TODO: prompt user for authorization
   */
  install?: string

  /**
   * use degit instead of git clone
   */
  degit?: boolean
}

export interface FromNetlifyExplorer {
  action: "FromNetlifyExplorer"
  source: NewProjectSourceSpecString
}

export interface FromCommandInvocation {
  action: "FromCommandInvocation"
  source?: NewProjectSourceSpecString
}

export interface InitAfterReload {
  action: "InitAfterReload"
  source: NewProjectSourceSpecString
  workspaceUri: string
  extraOpts?: ExtraOpts
}
