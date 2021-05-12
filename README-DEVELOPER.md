# Developer info

This file provides some details useful during development.

## Project repository

The project is hosted on GitHub:

- <https://github.com/xpack/hello-world-template-xpack.git>

To clone it:

```sh
cd ${HOME}/Work
git clone https://github.com/xpack/hello-world-template-xpack.git \
  hello-world-template-xpack.git
```

To clone the development branch:

```sh
git clone --branch xpack-develop \
  https://github.com/xpack/hello-world-template-xpack.git \
  hello-world-template-xpack.git
```

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

## Basic info

The package is both an xPack (used by `xpm`) and a Node.js module (for
running tests).

To be accepted as a template by `xpm init`, a project must:

- be an xPack (have a `package.json` with an `xpack` property
- have a property called `main` in `package.json`, pointing to a JavaScript
  file that can be consumed by `require()`
- the main file must export a class called `XpmInitTemplate`
- an instances of this class must have a `run()` method.

The template receives via the `context`:

- a log object `log`
- the new project `config.name`, either given explicitly via
  `--name` or infered from the folder name
- a map of `config.properties`, given explicitly via `--property name=value`

## Branches

Apart from the unused `master` branch, there are two active branches:

- `xpack`, with the latest stable version
- `xpack-develop`, with the current development version

All development is done in the `xpack-develop` branch, and contributions via
Pull Requests should be directed to this branch.

When new releases are published, the `xpack-develop` branch is merged
into `xpack`.

## Testing

Normally the tests should consume the template via `xpm init`, but
this goes through the global repo in the home folder, and requires to
uninstall the xPack, to be sure that the latest version is used.

To perform the tests, run the usual npm sequence:

```sh
cd hello-world-template-xpack.git
npm install
npm run test
```

## Coverage tests

- none so far.

## Continuous Integration

All available tests are also performed on GitHub Actions, as the
[CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml)
workflow.

## Standard compliance

The module uses ECMAScript 6 class definitions.

As style, it uses the [JavaScript Standard Style](https://standardjs.com/),
automatically checked at each commit via Travis CI.

Known and accepted exceptions:

- none.

To manually fix compliance with the style guide (where possible):

```console
% npm run fix

> @xpack/hello-world-template@0.1.0 fix
> standard --fix

```

## Documentation metadata

The documentation metadata follows the [JSdoc](http://usejsdoc.org) tags.

To enforce checking at file level, add the following comments right after
the `use strict`:

```js
'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */
```

Note: be sure C style comments are used, C++ styles are not parsed by
[ESLint](http://eslint.org).
