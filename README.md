[![npm (scoped)](https://img.shields.io/npm/v/@xpack/hello-world-template)](https://www.npmjs.com/package/@xpack/hello-world-template)
[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack)
[![license](https://img.shields.io/github/license/xpack/hello-world-template-xpack)](https://github.com/xpack/hello-world-template-xpack/blob/xpack/LICENSE)
[![CI on Push](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml/badge.svg)](https://github.com/xpack/hello-world-template-xpack/actions/workflows/CI.yml)

# A source xPack with a template to generate Hello World projects

Generate simple _Hello World_
projects to demonstrate the xPack Build framework.

The project is hosted on GitHub as
[xpack/hello-world-template-xpack](https://github.com/xpack/hello-world-template-xpack),
and is also available from npmjs.com as
[@xpack/hello-world-template](https://www.npmjs.com/package/@xpack/hello-world-template).

## Features

This project generates multiple variants of the classical application
that prints the _Hello World_ message on standard output.

Both C and C++ are supported, with **CMake** and **meson** as build system
generators; it is also possible to create projects that use the legacy
autotools & make, but only as a configuration demonstrator, for real
projects the configuration needs further tweaks.

The `hello-world-template` project is part of
[The xPack Project](https://github.com/xpack).

It can be invoked in a terminal, but the main intended use was
to be integrated into the **VS Code xPack Build extension**, to
generate new projects.

## Prerequisites

A recent [xpm](https://xpack.github.io/xpm/), which is a portable
[Node.js](https://nodejs.org/) command line application.

```sh
npm install --global xpm@latest
```

If installing over a previous version fails, uninstall first:

```sh
npm uninstall --global xpm@latest
npm install --global xpm@latest
```

## User info

### Template instantiation via `xpm init`

Instantiating the template can be done via the `xpm init --template` command,
pointing to this xPack.

This command must be invoked in an empty folder, where the project
will be generated.

There are two modes, interactive and non interactive (from a script).

#### Interractive mode

Starting the tool without any command line options will select the
interactive mode and the user can manually enter each choice.

Starting the tool without defining the programming language will select the
interactive mode and the user can manually enter each choice.

```console
% cd my-project
% xpm init --template @xpack/hello-world-template

Checking package @xpack/hello-world-template metadata...
Processing @xpack/hello-world-template@0.4.0...

Programming language? (c, cpp, ?) [cpp]: 
Build Generator? (cmake, meson, autotools, ?) [cmake]: 

Creating the C++ project 'cmake2'...
File 'include/hello-world.h' copied.
File 'src/hello-world.cpp' copied.
File 'libs/adder/include/add/add.h' copied.
File 'libs/adder/src/add.c' copied.
File 'meta/CMakeLists.txt' generated.
File '.vscode/tasks.json' copied.
File '.clang-format' copied.
File 'README.md' generated.
File 'LICENSE' generated.
File 'package.json' generated.
%
```

#### Scriptable mode

When used in non-interractive environments, it is possible to pass
all required data on the
command line. The only mandatory property is `language`, all other
have defaults.

```console
% cd my-project
% xpm init --template @xpack/hello-world-template --property language=cpp

Checking package @xpack/hello-world-template metadata...
Processing @xpack/hello-world-template@0.4.0...

Creating the C project 'my-project'...
- BuildGenerator=cmake

File 'include/hello-world.h' copied.
File 'src/hello-world.c' copied.
File 'libs/adder/include/add/add.h' copied.
File 'libs/adder/src/add.c' copied.
File 'meta/CMakeLists.txt' generated.
File '.vscode/tasks.json' copied.
File '.clang-format' copied.
File 'README.md' generated.
File 'LICENSE' generated.
File 'package.json' generated.
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
the build system generator can find it.

```console
% cd my-project
% xpm run test
> xpm run prepare-all
> xpm run prepare --config Debug
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
-- Project path: /Users/ilg/tmp/my-project
-- PATH: /Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/tmp/my-project/build/debug
> xpm run prepare --config Release
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
-- Project path: /Users/ilg/tmp/my-project
-- PATH: /Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/tmp/my-project/build/release
> xpm run build-all
> xpm run build --config Debug
> cmake -S meta -B build/debug -G Ninja -D CMAKE_BUILD_TYPE=Debug -D CMAKE_EXPORT_COMPILE_COMMANDS=ON
-- CMake version: 3.19.2-g60a09ee
-- Compiler: AppleClang 12.0.0.12000032
-- Build type: Debug
-- Project path: /Users/ilg/tmp/my-project
-- PATH: /Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/tmp/my-project/build/debug
> cmake --build build/debug --verbose
[1/3] /Library/Developer/CommandLineTools/usr/bin/cc -DDEBUG -I/Users/ilg/tmp/my-project/include -I/Users/ilg/tmp/my-project/libs/adder/include -g -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -fmessage-length=0 -fsigned-char -ffunction-sections -fdata-sections -flto -std=gnu11 -MD -MT CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -MF CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o.d -o CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -c /Users/ilg/tmp/my-project/libs/adder/src/add.c
[2/3] /Library/Developer/CommandLineTools/usr/bin/c++ -DDEBUG -I/Users/ilg/tmp/my-project/include -I/Users/ilg/tmp/my-project/libs/adder/include -g -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -fmessage-length=0 -fsigned-char -ffunction-sections -fdata-sections -flto -std=gnu++17 -MD -MT CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o -MF CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o.d -o CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o -c /Users/ilg/tmp/my-project/src/hello-world.cpp
[3/3] : && /Library/Developer/CommandLineTools/usr/bin/c++ -g -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -Wl,-search_paths_first -Wl,-headerpad_max_install_names -Wl,-dead_strip CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -o hello-world   && :
> xpm run build --config Release
> cmake -S meta -B build/release -G Ninja -D CMAKE_BUILD_TYPE=Release -D CMAKE_EXPORT_COMPILE_COMMANDS=ON
-- CMake version: 3.19.2-g60a09ee
-- Compiler: AppleClang 12.0.0.12000032
-- Build type: Release
-- Project path: /Users/ilg/tmp/my-project
-- PATH: /Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/tmp/my-project/xpacks/.bin:/Users/ilg/Library/Python/3.7/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/ilg/.nvm/versions/node/v14.16.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
-- ==> application
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ilg/tmp/my-project/build/release
> cmake --build build/release --verbose
[1/3] /Library/Developer/CommandLineTools/usr/bin/cc  -I/Users/ilg/tmp/my-project/include -I/Users/ilg/tmp/my-project/libs/adder/include -O3 -DNDEBUG -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -fmessage-length=0 -fsigned-char -ffunction-sections -fdata-sections -flto -std=gnu11 -MD -MT CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -MF CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o.d -o CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -c /Users/ilg/tmp/my-project/libs/adder/src/add.c
[2/3] /Library/Developer/CommandLineTools/usr/bin/c++  -I/Users/ilg/tmp/my-project/include -I/Users/ilg/tmp/my-project/libs/adder/include -O3 -DNDEBUG -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -fmessage-length=0 -fsigned-char -ffunction-sections -fdata-sections -flto -std=gnu++17 -MD -MT CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o -MF CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o.d -o CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o -c /Users/ilg/tmp/my-project/src/hello-world.cpp
[3/3] : && /Library/Developer/CommandLineTools/usr/bin/c++ -O3 -DNDEBUG -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk -Wl,-search_paths_first -Wl,-headerpad_max_install_names -Wl,-dead_strip CMakeFiles/application.dir/Users/ilg/tmp/my-project/src/hello-world.cpp.o CMakeFiles/application.dir/Users/ilg/tmp/my-project/libs/adder/src/add.c.o -o hello-world   && :
> xpm run execute-all
> xpm run execute --config Debug
> build/debug/hello-world
Hello World!
(in debug mode)
Check adder lib: 41 + 1 = 42
> xpm run execute --config Release
> build/release/hello-world
Hello World!
(in release mode)
(no asserts)
Check adder lib: 41 + 1 = 42
%
```

### Windows specifics

On Windows the projects generated by the template were tested with:

- the Microsoft C/C++ compiler, installed from the
[Build Tools for Visual Studio 2019](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019),
- GCC, installed with [Chocolatey](https://chocolatey.org), on GitHub Actions

## Known problems

- none.

## Maintainer & developer info

This page is addressed to those who plan to use the template directly.

For maintainer and developer info, please see the
[README-MAINTAINER](README-MAINTAINER.md) and
[README-DEVELOPER](README-DEVELOPER.md) pages.

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul/).
