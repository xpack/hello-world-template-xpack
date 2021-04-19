[![license](https://img.shields.io/github/license/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack/blob/xpack/LICENSE)
[![Node.js CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml/badge.svg)](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml)
[![GitHub issues](https://img.shields.io/github/issues/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/pulls/)

# Maintainer info

This file documents the procedure used to make releases.

## Project repository

The project is hosted on GitHub:

- <https://github.com/xpack/hello-world-template-xpack.git>

To clone it:

```sh
git clone https://github.com/xpack/hello-world-template-xpack.git hello-world-template-xpack.git
```

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

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
- commit with a message like _prepare v0.1.3_

## Prepare a new blog post

In the `xpack/web-jekyll` GitHub repo:

- select the `develop` branch
- add a new file to `_posts/hello-world-template-xpack/releases`
- name the file like `2020-12-19-hello-world-template-xpack-v0-1-0-released.md`
- name the post like: **hello-world-template-xpack v0.1.3 released**
- update the `date:` field with the current date
- update the GitHub Actions URLs using the actual test pages

If any, refer to closed
[issues](https://github.com/xpack/hello-world-template-xpack/issues/)
as:

- **[Issue:\[#1\]\(...\)]**.

## Publish on the npmjs.com server

- select the `xpack-develop` branch
- commit all changes
- update `CHANGELOG.md`; commit with a message like _CHANGELOG: prepare v0.1.3_
- `npm pack` and check the content of the archive, which should list
  only the `package.json`, the `README.md`, `LICENSE`, `CHANGELOG.md`
  and the `assets`; possibly adjust `.npmignore`
- `npm version patch`, `npm version minor`, `npm version major`
- push the `xpack-develop` branch to GitHub
- push the new tag, `git push origin --tags`
- wait for CI to finish
- `npm publish --tag next` (use `--access public` when publishing for
  the first time)

The version is visible at:

- <https://www.npmjs.com/package/@xpack/hello-world-template?activeTab=versions>

## Testing

The project includes unit tests.

To run them, run:

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
- `npm dist-tag add @xpack/hello-world-template@0.1.3 latest`
- `npm dist-tag ls @@xpack/hello-world-template`

## Announce to the community

Post an announcement to the forum.

## Share on Twitter

- in a separate browser windows, open [TweetDeck](https://tweetdeck.twitter.com/)
- using the `@xpack_project` account
- paste the release name like **hello-world-template-xpack v0.1.3 released**
- paste the link to the Web page release
- click the **Tweet** button
