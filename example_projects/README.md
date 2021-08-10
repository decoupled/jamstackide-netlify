# What?

A collection of projects used to showcase/test different features of the IDE.
Each project can be thought of as exemplifying a "use case", or story.

For example, the project [`debugging/static_html__js__js_functions`](./debugging/static_html__js__js_functions) is used to showcase the _Debugging_ feature, with a simple static HTML+JS frontend, and simple (non-transpiled/bundled) JS functions.

# Why?

- To help us develop each feature (it is easier to develop the extension by "opening" a simple, controlled project)
- To help us capture different permutations of factors that can affect each feature, and explore these permutations in relative isolation (ex: different frameworks, inline/external sourcemaps, typescript/js, functions in different languages, etc).

# Details

**Structure:**

The structure is flexible, but for now we're trying to stick to something that looks something like this:

- {feature} ex: netlify_toml, debugging
  - {project} a descriptive name for each project

You can name your project anything you want. The `misc` feature is a catch-all for projects that are not easily classified.

**Guidelines:**

- Try to focus on only one feature and one specific "variation" per project (ex: different language, different framework, etc)
- Keep projects small. Only the bare minimum to showcase/test the intended feature
- Add a README so the "tested" feature is clear. Animated gifs might also help.

# FAQ:

**Are these projects used for automated testing?**

Not yet. This is just for manual testing and developing for now.
Automated testing of extensions is tricky - emulating user interaction with VSCode is not a solved problem yet.
Having said that, these projects will provide a good starting point once we decide to write some for of e2e tests.
