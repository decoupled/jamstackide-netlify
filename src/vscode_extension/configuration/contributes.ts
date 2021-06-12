export function configuration_contributes() {
  return {
    configuration: {
      title: "Netlify",
      properties: {
        "netlify.experimental.enable": {
          type: "boolean",
          default: false,
          description:
            "Enable experimental features in the Netlify VSCode extension",
        },
      },
    },
  }
}
