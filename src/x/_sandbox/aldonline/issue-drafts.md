# Existing

# New

## Move code to this repo (chore)

Currently, the codebase is in a private repository here (@verythorough has access). As soon as it stabilizes I'll move it into this repo.

## Refactor utility libraries out of codebase (chore)

Currently, there is a significant amount of code that is general purpose and could be refactored out to libraries.

To remove all overhead and make it easy to develop (and debug) the Netlify Extension, I'm keeping this general purpose code in the same repo.

Here are a few libraries that we should extract from here:

- A better TOML parser (that lets you go back and forth between the TOML AST and the resulting data nodes)
- A million VSCode and Language Server Protocol utilities

## Remove autowire code from repo

Lambdragon has a dependency injection framework. It is still work in progress so, to make it easier to debug, the generated code is being.
In the fugure this will happen behind the scenes.

## `netlify.toml` autocompletion

## `netlify.toml` outline

## \_headers file syntax highlighting

This is implemented right now.
It could be improved upon by.

## Add README with instructions to install and try the extension

## Move most logic to a Language Server

# Labels
