[![license](https://img.shields.io/github/license/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack/blob/xpack/LICENSE)
[![CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml/badge.svg)](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml)
[![GitHub issues](https://img.shields.io/github/issues/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/pulls/)

# Maintainer info

This file documents the procedure used to make releases.

## Prepare the release

Before making the release, perform some checks and tweaks.

### Update npm packages

- `npm outdated`
- `npm update`
- repeat and possibly manually edit `package.json` until everything is
  up to date

### Check Git

In this Git repo:

- in the `develop` branch
- push everything
- if needed, merge the `master` branch

### Determine the next version

Use the semantic versioning semantics.

### Fix possible open issues

Check GitHub issues and pull requests:

- <https://github.com/xpack/hello-world-template-xpack/issues/>

### Update versions in the README files

- update version in `README-MAINTAINER.md`
- check the rest of the file and update if needed, to reflect the new features
- update version in `README.md`

## Update `CHANGELOG.md`

- check the latest commits `npm run git-log`
- open the `CHANGELOG.md` file
- check if all previous fixed issues are in
- commit with a message like _prepare v0.4.0_

## Publish on the npmjs.com server

- select the `xpack-develop` branch
- commit everything
- `npm run fix`
- commit all changes
- `npm run test-coverage`
- check the latest commits `npm run git-log`
- `npm run pack`; check the content of the archive, which should list
  only the `package.json`, the `README.md`, `LICENSE`, `CHANGELOG.md`
  and the `assets`; possibly adjust `.npmignore`
- `npm version patch`, `npm version minor`, `npm version major`
- push all changes to GitHub; this should trigger CI
- **wait for CI tests to complete**
- check <https://github.com/xpack/hello-world-template-xpack/actions/>
- `npm publish --tag next` (use `--access public` when publishing for
  the first time)

The version is visible at:

- <https://www.npmjs.com/package/@xpack/hello-world-template?activeTab=versions>

## Testing

The first test is via `xpm init`

```sh
mkdir -p ~/tmp/test-hello
cd ~/tmp/test-hello
xpm init --template @xpack/hello-world-template@next --property language=cpp
xpm install
xpm run test
```

The project also includes unit tests, which create multiple projects,
with combinations of properties.

To run them, use:

```sh
cd hello-world-template-xpack.git
xpm install
xpm run test
```

## Continuous Integration

All available tests are also performed on GitHub Actions, as the
[CI on Push](https://github.com/xpack/hello-world-template-xpack/actions?query=workflow%3A%22CI+on+Push%22)
workflow.

## Update the repo

When the package is considered stable:

- with Sourcetree
- merge `xpack-develop` into `xpack`
- push to GitHub
- select `xpack-develop`

## Tag the npm package as `latest`

When the release is considered stable, promote it as `latest`:

- `npm dist-tag ls @xpack/hello-world-template`
- `npm dist-tag add @xpack/hello-world-template@0.4.0 latest`
- `npm dist-tag ls @@xpack/hello-world-template`
