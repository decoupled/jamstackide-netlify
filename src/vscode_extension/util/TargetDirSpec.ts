/**
 * Specifies where to create a new project
 */
export type TargetDirSpec = SpecificTargetDir | AutoTargetDir | ChooseTargetDir

/**
 * a specific folder. no questions asked to the user
 */
export interface SpecificTargetDir {
  kind: "specific"
  dir: string
}

/**
 * let the tool choose a target dir
 */
export interface AutoTargetDir {
  kind: "auto"
  defaultRootDir: string
}

/**
 * let the user choose a target dir
 */
export interface ChooseTargetDir {
  kind: "choose"
  defaultRootDir?: string
}
