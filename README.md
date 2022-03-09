ogle
===

`ogle` is a template for running shaders and doing shader live-coding. It originally used `ogl`, hence the name, but I've since changed it to use `regl`. It's also an experiment with using `parcel` for frontend development.

It currently uses `monaco` as a text editor, with `tree-sitter` for glsl syntax highlighting.

TODO

- [ ] Code completion with LSP
- [ ] Live collaboration with CRDTs? Maybe `yjs`?

```
# start a dev server
yarn start

# build the project
yarn build
```
