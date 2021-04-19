# Developer info

## Basic info

To be accepted as a template by `xpm init`, a project must:

- be an xPack (have a `package.json` with an `xpack` property
- have a property called `main` in `package.jso`n, pointing to a JavaScript
  file that can be consumed by `require()`
- the main file must export a class called `XpmInitTemplate`
- an instances of this class must have a `run()` method.

The template receives via the `context`:

- a log object `log`
- the new project `config.name`, either given explicitly via
  `--name` or infered from the folder name
- a map of `config.properties`, given explicitly via `--property name=value`

## Testing

Normally the tests should consume the template via `xpm init`, but
this goes through the global repo in the home folder, and requires to
uninstall the xPack, to be sure that the latest version is used.
