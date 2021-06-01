import nc from "@netlify/config"

{
  const dir = "/Users/aldo/com.github/decoupled/netlify-test-site"
  console.log(typeof nc)
  const res = await nc({ cwd: dir, offline: true })
  console.log(res)
}

const res = {
  siteInfo: {},
  env: {
    CONTEXT: {
      sources: ["general"],
      value: "production",
    },
    BRANCH: {
      sources: ["general"],
      value: "master",
    },
    HEAD: {
      sources: ["general"],
      value: "master",
    },
    COMMIT_REF: {
      sources: ["general"],
      value: "01f12ec5d090960c48daed4895ecae08cb507081",
    },
    PULL_REQUEST: {
      sources: ["general"],
      value: "false",
    },
    LANG: {
      sources: ["general"],
      value: "en_US.UTF-8",
    },
    LANGUAGE: {
      sources: ["general"],
      value: "en_US:en",
    },
    LC_ALL: {
      sources: ["general"],
      value: "en_US.UTF-8",
    },
    GATSBY_TELEMETRY_DISABLED: {
      sources: ["general"],
      value: "1",
    },
    NEXT_TELEMETRY_DISABLED: {
      sources: ["general"],
      value: "1",
    },
  },
  configPath: "/Users/aldo/com.github/decoupled/netlify-test-site/netlify.toml",
  buildDir: "/Users/aldo/com.github/decoupled/netlify-test-site",
  repositoryRoot: "/Users/aldo/com.github/decoupled/netlify-test-site",
  config: {
    functionsDirectory:
      "/Users/aldo/com.github/decoupled/netlify-test-site/netlify/functions",
    functionsDirectoryOrigin: "default",
    dev: {
      targetPort: 4000,
    },
    functions: {
      "*": {},
    },
    plugins: [],
    build: {
      environment: {},
      functions:
        "/Users/aldo/com.github/decoupled/netlify-test-site/netlify/functions",
    },
  },
  context: "production",
  branch: "master",
}
