[![license](https://img.shields.io/github/license/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack/blob/xpack/LICENSE)
[![CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/ci.yml/badge.svg)](https://github.com/xpack/hello-world-template-xpack/actions/workflows/ci.yml)
[![GitHub issues](https://img.shields.io/github/issues/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/pulls/)

# Maintainer info

This file documents the procedure used to make releases.

## Prepare the release

Before making the release, perform some checks and tweaks.

### Update npm packages

- `npm outdated`
- edit `package.json` and run `npm install`
- repeat until everything is up to date

### Check Git

In this Git repository:

- switch to the `xpack-development` branch
- push everything
- if needed, merge the `xpack` branch

### Determine the next version

Use semantic versioning conventions.

Update the version in `package.json` to the new version with a `-pre` suffix.

### Fix possible open issues

Check GitHub issues and pull requests:

- <https://github.com/xpack/hello-world-template-xpack/issues>

### Update versions in the README files

- update the version in `README-MAINTAINER.md`
- check the rest of the file and update if needed to reflect the new features
- update the version in `README.md`

## Update `CHANGELOG.md`

- check the latest commits: `npm run git-log`
- open the `CHANGELOG.md` file
- check if all previously fixed issues are included
- commit with a message such as _prepare v0.7.0_

## Publish on the npmjs.com server

- select the `xpack-development` branch
- commit everything
- `npm run fix`
- commit all changes
- `npm run test-all`
- check the latest commits: `npm run git-log`
- `npm run npm-pack`; check the content of the archive, which should list
  only the following items; adjust `.npmignore` if necessary

```console
CHANGELOG.md
LICENSE
README.md
dist/...
templates/...
src/...
package.json
=== Bundled Dependencies ===
```

- `npm version patch`, `npm version minor`, or `npm version major`
- push all changes to GitHub; this should trigger the CI workflow
- push the tag
- **wait for CI tests to complete**
- check <https://github.com/xpack/hello-world-template-xpack/actions>
- `npm publish --tag next` (use `--access public` when publishing for
  the first time)

The version is visible at:

- <https://www.npmjs.com/package/@xpack/hello-world-template?activeTab=versions>

## Testing

The first test is via `xpm init`:

```sh
mkdir -p ~/tmp/test-hello
cd ~/tmp/test-hello
xpm init --template @xpack/hello-world-template@next --property language=cpp
xpm install
xpm run test-all
```

The project also includes unit tests, which create multiple projects
with combinations of properties.

To run them, use:

```sh
cd "${HOME}/Work/xpack/hello-world-template-xpack.git"
npm install
npm run test-all
```

## Continuous Integration

All available tests are also performed on GitHub Actions, as the
[CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/test-ci.yml)
workflow.

## Update the repo

When the package is considered stable:

- merge `xpack-development` into `xpack`
- push to GitHub
- switch back to `xpack-development`

## Tag the npm package as `latest`

When the release is considered stable, promote it as `latest`:

- `npm dist-tag ls @xpack/hello-world-template`
- `npm dist-tag add @xpack/hello-world-template@0.7.0 latest`
- `npm dist-tag ls @xpack/hello-world-template`
