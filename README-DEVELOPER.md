# Developer info

To be accepted as a template by `xpm init`, a project must:

- be an xPack (have a `package.json` which includes an `xpack` property
- have a property called `main` in `package.jso`n, pointing to a JavaScript
  file that can be consumed by `require()`
- the main file must export a class called `XpmInitTemplate`
- an instances of this class must have a `run()` method.

The template receives in the `context`:

- a log object `log`
- the new project `config.name`, either given explicitly via
  `--name` or infered from the folder name
- a map of `config.properties`, given explicitly via `--property name=value`
