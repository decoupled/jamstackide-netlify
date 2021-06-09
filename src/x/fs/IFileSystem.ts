export interface IFileSystem {
  existsSync(path: string): boolean
  readFileSync(path: string): string
  readdirSync(path: string): string[]
  globSync(pattern: string): string[]
  writeFileSync(path: string, contents: string): void
}
