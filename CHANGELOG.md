# Change & release log

Releases in reverse chronological order.

Please check
[GitHub](https://github.com/xpack/hello-world-template-xpack/issues/)
and close existing issues and pull requests.

## 2023-09-26

* prepare v0.6.1
* 5b76268 .gitignore update
* 6eb05e7 package-liquid.json: bump deps
* d1b5076 migrate to ESM
* 0fd09af package.json: bump deps
* f8e9d4f package.json: update scripts
* a06fc9d package.json: engines.node >=16.14.0
* 2dd911d package.json: type: module
* 4bde22f rename ci.yml
* e89f683 ci.yml: bump deps

## 2023-02-08

* 7e6b6e9 test.js: add commented out xpm --version

## 2023-02-02

* f380798 README update test-all example

## 2022-12-23

* 2541088 .vscode/settings.json: ignoreWords

## 2022-08-16

* 5b183b4 package.json: update scripts
* 7a8d545 README-MAINTAINER update
* 04f4ea7 0.6.0
* a6d78df .npmignore build
* 075aecb prepare v0.6.0
* 0241e29 package.json: bump deps and minimumXpmRequired 0.14.0
* 2a404b3 package-liquid.json: minimumXpmRequired 0.14.0

## 2022-08-08

* 90e2103 test.js: develop test with gcc
* ea7e8f2 makefile-liquid: use -static-lib
* d05c39a meson-liquid.build: fix compiler test
* d00bde6 try -static-lib for gcc
* a00301b CI.yml: node 14, 16

## 2022-08-07

* 04edb78 CI.yml: update from qemu template
* aac2da4 CI.yml: test-ci
* 5d92b0c rename a.vscode
* 10df8e2 CI.yml: run test-all
* a07b54b #10: Get the author name & email from git config
* a8db56d #9: rework and add support for clang
* 00cb2cc README-MAINTAINER update
* 0fee1d6 /vscode/settings.json: ignore cmake/make
* 5b2cf04 .gitignore build/
* d666f79 package.json: more npm scripts
* 95e4725 package.json: bump minimumXpmRequired 0.13.7
* 5b669dd package.json: bump deps
* 485b417 package.json: add git-config-path & co deps

## 2021-12-13

* v0.5.2 released
* bump binary xPack versions
* add CMake hack to use `gcc.cmd` on Windows

## 2021-06-26

* v0.5.1 released
* [#7] - define `-std` properly for meson

## 2021-06-16

* v0.5.0 prepared

## 2021-05-25

* v0.4.2 released
* fix uninstall syntax in README
* [#5] display all properties in non-interactive mode
* [#4] add support for xPack GCC
* [#3] fix linker options on macOS

## 2021-05-12

* v0.3.0 released
* update messages to use Build System

## 2021-04-30

* v0.2.0 released
* add autotools & make support
* add simple adder library
* add meson support

## 2021-04-19

* v0.1.3 released
* replace shelljs & readlineSync with discrete implementation
* add bundledDependencies
* v0.1.2 released
* v0.1.1 released
* CMake C/C++ project functional on GitHub Actions

## 2021-04-16

Created from the SiFive template.
