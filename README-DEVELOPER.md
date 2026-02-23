# Developer info

This file provides some details useful during development.

## Project repository

The project is hosted on GitHub:

- <https://github.com/xpack/hello-world-template-xpack.git>

To clone it:

```sh
rm -rf "${HOME}/Work/xpack/hello-world-template-xpack.git" && \
mkdir -p "${HOME}/Work/xpack" && \
git clone https://github.com/xpack/hello-world-template-xpack.git \
  "${HOME}/Work/xpack/hello-world-template-xpack.git"
```

To clone the development branch:

```sh
rm -rf "${HOME}/Work/xpack/hello-world-template-xpack.git" && \
mkdir -p "${HOME}/Work/xpack" && \
git clone --branch xpack-development \
  https://github.com/xpack/hello-world-template-xpack.git \
  "${HOME}/Work/xpack/hello-world-template-xpack.git"
```

If update an existing repository:

```sh
git -C "${HOME}/Work/xpack/hello-world-template-xpack.git" pull
```

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

## Basic info

The package is both an xPack (used by `xpm`) and a Node.js module (for
running tests).

To be accepted as a template by `xpm init`, a project must:

- be an xPack (have a `package.json` with an `xpack` property)
- have a property called `main` in `package.json`, pointing to a JavaScript
  file that can be consumed by `import`
- the main file must export a class derived from `xpmLib.InitTemplateBase`, for
  exaple `XpmInitTemplate`

The template receives via the `context`:

- a log object `log`
- the new project `config.projectName`, either given explicitly via
  `--name` or inferred from the folder name
- a (posibly empty) `config.properties` object, with the command line
  options given explicitly via `--property name=value`

## Branches

Apart from the unused `master` branch, there are two active branches:

- `xpack`, with the latest stable version
- `xpack-development`, with the current development version

All development is done in the `xpack-development` branch, and contributions via
Pull Requests should be directed to this branch.

When new releases are published, the `xpack-development` branch is merged
into `xpack`.

## Testing

Normally the tests should consume the template via `xpm init`, but
this goes through the global repo in the home folder, and requires to
uninstall the xPack, to be sure that the latest version is used.

To perform the tests, run the usual npm sequence:

```sh
cd "${HOME}/Work/xpack/hello-world-template-xpack.git"
npm install
npm run test
```

## Coverage tests

- none so far.

## Continuous Integration

All available tests are also performed on GitHub Actions, as the
[CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/test-ci.yml)
workflow.

## Standard compliance

The module uses ECMAScript 6 class definitions.

As style, it uses the [typescript-eslint](https://typescript-eslint.io/packages/typescript-eslint/),
automatically checked at each commit via GitHub Actions.

Known and accepted exceptions:

- none.

To manually fix compliance with the style guide (where possible):

```console
% npm run fix

> @xpack/hello-world-template@0.7.0 fix
> eslint --config config/eslint.config.js --fix src tests
...
```

## Documentation metadata

The documentation metadata follows the [TSDoc](https://tsdoc.org) tags.

> [!IMPORTANT]
> Be sure C style comments are used, C++ styles are not parsed by
[ESLint](http://eslint.org).
