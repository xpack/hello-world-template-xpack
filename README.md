[![license](https://img.shields.io/github/license/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack/blob/xpack/LICENSE)
[![Node.js CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml/badge.svg)](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml)

# A source xPack with a template to generate Hello World projects

Generate simple _Hello World_
projects to demonstrate the xPack Build framework.

The project is hosted on GitHub as
[micro-os-plus/hello-world-template-xpack](https://github.com/micro-os-plus/hello-world-template-xpack).

## Features

This project generates multiple variants of the classical application
that prints the _Hello World_ message on standard output.

Both C and C++ are supported, with **CMake** and **meson** as system build
generators.

This sub-project is part of [The xPack Project](https://github.com/xpack).

It is intended to be invoked by the **VSCode xPack Build extension** to
generate new projects.

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

## User info

### Template instantiation

Instantiating the template can be done via the `xpm init` command,
pointing to this xPack:

```sh
% mkdir -p my-project
% cd my-project
% xpm init --template @xpack/hello-world-template
...
```

This command must be invoked in an empty folder, where the project
will be generated.

There are two modes, interactive and non interactive (from a script).

Starting the tool without any command line options will select the
interactive mode and the user can manually enter each choice.

Starting the tool without defining the programming language will select the
interactive mode and the user can manually enter each choice.

```console
% cd my-project
% xpm init --template @xpack/hello-world-template

Checking package @xpack/hello-world-template metadata...
Processing @xpack/hello-world-template@0.1.3...

Programming language? (c, cpp, ?) [c]: 
Build Generator? (cmake, meson, ?) [cmake]: 

Creating the C project 'my-project'...
File 'LICENSE' generated.
File 'package.json' generated.
File 'README.md' generated.
File 'include/hello-world.h' copied.
File 'src/hello-world.c' copied.
File 'meta/CMakeLists.txt' generated.
File '.vscode/tasks.json' copied.
%
```

When used in scripts, it is possible to pass all required data on the
command line. The only mandatory property is `language`, all other
have defaults.

```console
% cd my-project
% xpm init --template @xpack/hello-world-template --property language=c

Checking package @xpack/hello-world-template metadata...
Processing @xpack/hello-world-template@0.1.3...

Creating the C project 'my-project'...
- BuildGenerator=cmake

Creating the C project 'my-project'...
File 'LICENSE' generated.
File 'package.json' generated.
File 'README.md' generated.
File 'include/hello-world.h' copied.
File 'src/hello-world.c' copied.
File 'meta/CMakeLists.txt' generated.
File '.vscode/tasks.json' copied.
%
```

### Satisfy dependencies

The next step is to install all packages required, either source packages or
binary tools.

This is done by issuing the `xpm install` command in the project folder:

```console
% cd my-project
% xpm install
@my-scope/my-project...
+ @xpack-dev-tools/cmake@3.19.2-2.1
+ @xpack-dev-tools/ninja-build@1.10.2-2.1
'xpacks/xpack-dev-tools-cmake' -> '/Users/ilg/Library/xPacks/@xpack-dev-tools/cmake/3.19.2-2.1'
'xpacks/xpack-dev-tools-ninja-build' -> '/Users/ilg/Library/xPacks/@xpack-dev-tools/ninja-build/1.10.2-2.1'
'xpacks/.bin/ccmake' -> '../xpack-dev-tools-cmake/.content/bin/ccmake'
'xpacks/.bin/ninja' -> '../xpack-dev-tools-ninja-build/.content/bin/ninja'
'xpacks/.bin/cmake' -> '../xpack-dev-tools-cmake/.content/bin/cmake'
'xpacks/.bin/cpack' -> '../xpack-dev-tools-cmake/.content/bin/cpack'
'xpacks/.bin/ctest' -> '../xpack-dev-tools-cmake/.content/bin/ctest'
% 
```

## Build and test

The generated project includes dependencies to all build tools, except
the toolchain, which must be available in a system location, such that
CMake can find it.

```console
% cd my-project
% xpm run test
> xpm run build-all
> xpm run build --config Debug
> cmake -S meta -B build/debug -G Ninja -D CMAKE_BUILD_TYPE=Debug -D CMAKE_EXPORT_COMPILE_COMMANDS=ON
-- CMake version: 3.19.2-g60a09ee
-- The C compiler identification is AppleClang 12.0.0.12000032
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /Library/Developer/CommandLineTools/usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- The ASM compiler identification is Clang
-- Found assembler: /Library/Developer/CommandLineTools/usr/bin/cc
-- Compiler: AppleClang 12.0.0.12000032
-- Build type: Debug
-- Project path: /Users/ilg/my-project
-- PATH: /Users/ilg/my-project/xpacks/.bin:/Users/ilg/my-project/xpacks/.bin:/Users/ilg/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/my-project/build/debug
> cmake --build build/debug
[2/2] Linking C executable hello-world
> xpm run build --config Release
> cmake -S meta -B build/release -G Ninja -D CMAKE_BUILD_TYPE=Release -D CMAKE_EXPORT_COMPILE_COMMANDS=ON
-- CMake version: 3.19.2-g60a09ee
-- The C compiler identification is AppleClang 12.0.0.12000032
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /Library/Developer/CommandLineTools/usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- The ASM compiler identification is Clang
-- Found assembler: /Library/Developer/CommandLineTools/usr/bin/cc
-- Compiler: AppleClang 12.0.0.12000032
-- Build type: Release
-- Project path: /Users/ilg/my-project
-- PATH: /Users/ilg/my-project/xpacks/.bin:/Users/ilg/my-project/xpacks/.bin:/Users/ilg/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/my-project/build/release
> cmake --build build/release
[2/2] Linking C executable hello-world
> xpm run execute-all
> xpm run execute --config Debug
> build/debug/hello-world
Hello World!
(in debug mode)
> xpm run execute --config Release
> build/release/hello-world
Hello World!
(in release mode)
(no asserts)
%
```

### Windows notice

On Windows the projects generated by the template were tested with:

- the Microsoft C/C++ compiler, installed from the
[Build Tools for Visual Studio 2019](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019),
- GCC, installed with [Chocolatey](https://chocolatey.org), on GitHub Actions

## Known problems

- the initial version does not provide support for meson, it'll be
  added in a future release

## Maintainer & developer info

This page is addressed to those who plan to use the template directly.

For maintainer and developer info, please see the
[README-MAINTAINER](README-MAINTAINER.md) and
[README-DEVELOPER](README-DEVELOPER.md) files.

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul/).
