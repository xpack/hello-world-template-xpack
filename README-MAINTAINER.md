[![license](https://img.shields.io/github/license/xpack/hello-world-template)](https://github.com/xpack/hello-world-template/blob/xpack/LICENSE)
[![CI on Push](https://github.com/xpack/hello-world-template/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/hello-world-template/actions?query=workflow%3A%22CI+on+Push%22)
[![GitHub issues](https://img.shields.io/github/issues/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/hello-world-template-xpack.svg)](https://github.com/xpack/hello-world-template-xpack/pulls/)

# Maintainer info

The package is both an xPack (used by `xpm`) and a Node.js module (for
running tests).

## Project repository

The project is hosted on GitHub:

- https://github.com/xpack/hello-world-template-xpack.git

To clone it:

```sh
git clone https://github.com/xpack/hello-world-template-xpack.git hello-world-template-xpack.git
```

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

## Prepare a new blog post

In the `xpack/web-jekyll` GitHub repo:

- select the `develop` branch
- add a new file to `_posts/hello-world-template-xpack/releases`
- name the file like `2020-12-19-hello-world-template-xpack-v0-1-0-released.md`
- name the post like: **xPack hello-world-template-xpack v0.1.0 released**
- update the `date:` field with the current date
- update the GitHub Actions URLs using the actual test pages

If any, refer to closed
[issues](https://github.com/xpack/hello-world-template-xpack/issues/)
as:

- **[Issue:\[#1\]\(...\)]**.

## Publish on the npmjs.com server

- select the `xpack-develop` branch
- commit all changes
- update `CHANGELOG.md`; commit with a message like _CHANGELOG: prepare v0.1.0_
- `npm pack` and check the content of the archive, which should list
  only the `package.json`, the `README.md`, `LICENSE` and `CHANGELOG.md`;
  possibly adjust `.npmignore`
- `npm version patch`, `npm version minor`, `npm version major`
- push the `xpack-develop` branch to GitHub with `git push origin --tags`
- `npm publish --tag next` (use `--access public` when publishing for
  the first time)

The version is visible at:

- https://www.npmjs.com/package/@xpack/hello-world-template-xpack?activeTab=versions

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

- `npm dist-tag ls @xpack/hello-world-template-xpack`
- `npm dist-tag add @xpack/hello-world-template-xpack@0.1.0 latest`
- `npm dist-tag ls @@xpack/hello-world-template-xpack`

## Announce to the community

Post an announcement to the forum.

## Share on Twitter

- in a separate browser windows, open [TweetDeck](https://tweetdeck.twitter.com/)
- using the `@xpack_project` account
- paste the release name like **xPack hello-world-template-xpack v0.1.0 released**
- paste the link to the Web page release
- click the **Tweet** button

