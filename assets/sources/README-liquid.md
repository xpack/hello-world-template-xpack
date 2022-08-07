# Hello World

The _Hello World_ project provides a **functional starting point**
for more complex applications.

It also demonstrates a **convenient way of managing dependencies**,
as implemented by the
[xPack Reproducible Build Framework](https://xpack.github.io).

## `xpm init`

This project was created with the
[xpack/hello-world-template-xpack](https://github.com/xpack/hello-world-template-xpack)
project template, using the following command:

```sh
cd <project>
xpm init --template {{ package.name }}/{{ package.version }}{% for property in properties %} --property {{ property[0] }}={{ property[1]}}{% endfor %}
```

## `xpm install`

As usual with npm and xpm projects, to facilitate running the tests
on Continuous Integration environments there is a way to automate
installing the required tools, like build tools, defined as `devDependencies`.

This mechanism is also useful during normal development, so it is
recommended to use the existing binary xPacks as build tools, by
listing them in the `devDependencies`.

Even more, it is possible to define dependencies specific to
build configurations; this allows, for example, to run the builds
with different versions of the same toolchain.

The command can be invoked by running it in a terminal:

```sh
cd <project>
xpm install
```

## Build configurations

The project borrows the structure from Eclipse CDT projects,
with two configurations, **debug** and **release**.

## Out of source tree builds

Having two build configurations, each with its own build folder,
the builds inherently cannot run in the source tree and require
separate build folders.

The two build folders are:

- `build/debug`
- `build/release`

## Project structure

The code is split into separate `src` and `include` folders.

The project also demonstrates a simple library, located in the separate
`libs/adder` folder.

## Actions

The project has several actions for each build configuration:

- `prepare`: create the build folders
- `build`: update the build folders to cope with possible changes in
  the project structure, and run the actual build
- `clean`: remove all binary objects and temporary files; do not delete
  build folder
- `execute`: run the application

There are also several top actions, which perform multiple commands:

- `test-debug`
- `test-release`
- `test-all`

The `test` action performs the prepare/build/execute, and can be used
to test the project in CI environments.

The full test suite can be invoked with a simple command:

```sh
xpm run test-all
```

## IntelliSense

The project is VS Code friendly, and when using the VS Code xPack
Managed Build Tools extension the `.vscode/c_cpp_properties.json` file
is managed automatically.

The best way to configure IntelliSense is to use a
`compile_commands.json` file, since this fully automates the process.

An example of such a file is:

```json
{
  "configurations": [
    {
      "name": "debug",
      "compileCommands": "${workspaceFolder}/build/debug/compile_commands.json"
    },
    {
      "name": "release",
      "compileCommands": "${workspaceFolder}/build/release/compile_commands.json"
    }
  ],
  "version": 4
}
```

This file is automatically created and updated by the xPack extension, so
the user should not be very concerned about it.

However, only modern tools (like CMake and meson) can generate this file.

If the project uses other tools, like autotools & make, the
`c_cpp_properties.json` file must be edited and specific details (like
the include folders an preprocessor definitions) must be provided
for each build configuration.

An example of such a file is:

```json
{
  "configurations": [
    {
      "name": "Debug",
      "configurationProvider": "ms-vscode.makefile-tools",
      "includePath": [
        "${workspaceFolder}/include",
        "${workspaceFolder}/libs/adder/include"
      ],
      "defines": [
        "DEBUG"
      ]
    },
    {
      "name": "Release",
      "configurationProvider": "ms-vscode.makefile-tools",
      "includePath": [
        "${workspaceFolder}/include",
        "${workspaceFolder}/libs/adder/include"
      ],
      "defines": [
        "NDEBUG"
      ]
    }
  ],
  "version": 4
}
```

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul/).
