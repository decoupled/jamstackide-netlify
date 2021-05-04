export type ResolvedNetlifyDevSettings = typeof example_settings[number]

const example_settings = [
  {
    framework: "next",
    command: "yarn",
    frameworkPort: 3000,
    possibleArgsArrs: [["dev"], ["build"], ["start"]],
    dist: "/Users/aldo/jamstackide-projects/next-starter-jamstack/out",
    args: ["dev"],
    port: 8888,
    jwtRolePath: "app_metadata.authorization.roles",
    functionsPort: 63854,
  },
  {
    framework: "gatsby",
    command: "yarn",
    frameworkPort: 8000,
    env: { GATSBY_LOGGER: "yurnalist" },
    possibleArgsArrs: [["develop"], ["start"]],
    dist: "public",
    args: ["develop"],
    port: 8888,
    jwtRolePath: "app_metadata.authorization.roles",
    functionsPort: 63856,
  },
  {
    framework: undefined,
    command: undefined,
    noCmd: true,
    frameworkPort: 3999,
    dist: "/Users/aldo/jamstackide-projects/redwood-app",
    port: 8888,
    jwtRolePath: "app_metadata.authorization.roles",
    functionsPort: 63858,
  },
]
