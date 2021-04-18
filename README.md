# A source xPack with a template to generate Hello World projects

Generate simple _Hello World_
projects to demonstrate the xPack Build framework.

## Maintainer info

This page is addressed to those who plan to use the template directly.

For maintainer infos, please see the
[README-MAINTAINER](README-MAINTAINER.md) file.

## Features

This project generates multiple variants of the classical application
that prints the _Hello World_ message on standard output.

Both C and C++ are supported, with **CMake** and **meson** as system build
generators.

This sub-project is part of [The xPack Project](https://github.com/xpack).

It is intended to be invoked by the **VSCode xPack Build extension** to
generate new projects.

## How to use

This section is intended for developers who plan to use this package to
create projects for SiFive Core Complex.

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

### Template instantiation

Instantiating the template can be done via the `xpm init` command,
pointing to this xPack:

```sh
mkdir -p my-project
cd my-project
xpm init --template @xpack/hello-world-template
```

This command must be invoked in an empty folder, where the project
will be generated.

There are two modes, interactive and non interactive (from a script).

Starting the tool without any command line options will select the
interactive mode and the user can manually enter each choice.

TBD

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul/).
