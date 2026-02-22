/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2021-2026 Liviu Ionescu. All rights reserved.
 *
 * This Software is provided under the terms of the MIT License.
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/mit.
 */

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * The XpmInitTemplate module.
 *
 * @remarks
 * It is re-exported publicly by `index.js`. The `xpm init --template`
 * command imports it via the `main` property of `package.json`, instantiates
 * it with the current context, which includes the log and the configurations,
 * then invokes the `run()` method.
 */

// ----------------------------------------------------------------------------

import * as fs from 'fs/promises'
import * as path from 'path'

import * as util from 'util'
import { fileURLToPath } from 'url'

// https://www.npmjs.com/package/git-config-path
import gitConfigPath from 'git-config-path'
// https://www.npmjs.com/package/parse-git-config
import parseGitConfig from 'parse-git-config'

import * as xpmLib from '@xpack/xpm-lib'
import assert from 'node:assert'

// ----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ----------------------------------------------------------------------------
// Type Definitions

/**
 * Git configuration interface.
 */
interface GitConfig {
  user?: {
    name?: string
    email?: string
  }
}

/**
 * Author information interface.
 */
interface Author {
  name: string
  email: string
  url: string
}

/**
 * Matrix configuration interface.
 */
interface Matrix {
  language: 'c' | 'cpp'
  buildGenerator: 'cmake' | 'meson' | 'autotools'
  toolchain?: 'gcc' | 'clang' | 'system'
}

// ----------------------------------------------------------------------------
// Data definitions.

const propertiesDefinitions: xpmLib.InitTemplatePropertiesDefinitions = {
  language: {
    label: 'Programming language',
    description: 'Select the preferred programming language',
    type: 'select',
    items: {
      c: 'C for the application files',
      cpp: 'C++ for the application files',
    },
    default: 'cpp',
    isMandatory: true,
  },
  buildGenerator: {
    label: 'Build System',
    description: 'Select the tool to generate the builds',
    type: 'select',
    items: {
      cmake: 'The CMake build system',
      meson: 'The Meson build system',
      autotools: 'Autotools configure & GNU make (legacy)',
    },
    default: 'cmake',
  },
  toolchain: {
    label: 'Toolchain',
    description: 'Select the toolchain to be used by the builds',
    type: 'select',
    items: {
      gcc: {
        // There is no gcc on macOS.
        platforms: ['linux', 'win32'],
        message: 'The xPack GNU Compiler Collection (GCC) toolchain',
      },
      clang: 'The xPack LLVM clang toolchain',
      system: {
        // There is no system toolchain on Windows.
        platforms: ['linux', 'darwin'],
        message: 'The system toolchain',
      },
    },
    default: 'clang',
  },
}

// ============================================================================

/**
 * XpmInitTemplate class.
 *
 * @remarks
 * This class extends the InitTemplateBase class from @xpack/xpm-lib.
 * It provides the template generation logic for creating Hello World projects
 * with different build systems (CMake, Meson, Autotools) and programming
 * languages (C, C++).
 * <ul>
 *   <li>Provided properties: language (c, cpp), buildGenerator (cmake,
 *   meson, autotools)</li>
 *   <li>Computed properties: fileExtension (c, cpp)</li>
 * </ul>
 *
 * The result is stored in the properties map:
 * <code>context.config.properties[key] = value</code>.
 * The description is shown when <code>?</code> is entered as selection.
 */
export class XpmInitTemplate extends xpmLib.InitTemplateBase {
  // --------------------------------------------------------------------------

  /**
   * Construct the template instance.
   *
   * @param options - The template options.
   * @param options.context - The template context containing log and
   * configuration.
   * @param options.policies - Optional policies for template generation.
   */
  constructor({ context, policies }: xpmLib.InitTemplateConstructorParameters) {
    super({
      context,
      templatesPath: path.resolve(__dirname, '..', 'templates', 'sources'),
      __dirname: path.dirname(__dirname),

      policies,
      propertiesDefinitions,
    })
  }

  /**
   * Generate the project files.
   *
   * @remarks
   * This method generates the project files based on the selected programming
   * language, build generator, and toolchain. It performs the following steps:
   * <ol>
   *   <li>Reads the Git configuration to populate author information</li>
   *   <li>Loads the template package metadata</li>
   *   <li>Determines the file extension based on the selected language</li>
   *   <li>Generates the source files, build files, and configuration
   *   files</li>
   * </ol>
   *
   * @returns A promise that resolves when generation is complete.
   */
  async generate(): Promise<void> {
    const log = this.log
    const context = this.context
    const config = context.config

    const substitutionsVariables = this.substitutionsVariables
    assert(substitutionsVariables, 'Substitutions variables not initialised')

    const gitConfigPathValue: string | null = gitConfigPath('global')
    const gitConfigResult = gitConfigPathValue
      ? parseGitConfig.sync({ path: gitConfigPathValue })
      : null
    const gitConfig: GitConfig = (gitConfigResult ?? {}) as GitConfig
    gitConfig.user ??= {}
    log.trace(util.inspect(gitConfig))

    const author: Author = {
      name: gitConfig.user.name ?? 'my name',
      email: gitConfig.user.email ?? 'my@eMail.com',
      url:
        gitConfig.user.email === 'ilg@livius.net'
          ? 'https://github.com/ilg-ul'
          : 'https://my-url',
    }
    substitutionsVariables.author = author

    const githubId: string =
      gitConfig.user.email === 'ilg@livius.net' ? 'ilg-ul' : 'my-github-id'
    substitutionsVariables.githubId = githubId

    // Add package (for name & version)
    const packageJsonPath: string = path.resolve(
      path.dirname(this.__dirname),
      'package.json'
    )
    const packageJsonContent: Buffer = await fs.readFile(packageJsonPath)
    const packageJson: xpmLib.JsonNpmPackage = JSON.parse(
      packageJsonContent.toString()
    ) as xpmLib.JsonNpmPackage
    substitutionsVariables.package = packageJson

    const matrix = substitutionsVariables.matrix as unknown as Matrix
    const fileExtension: string = matrix.language
    substitutionsVariables.fileExtension = fileExtension

    const lang: string = matrix.language === 'cpp' ? 'C++' : 'C'
    log.info(
      `Creating the ${lang} project ` +
        `'${substitutionsVariables.projectName as string}'...`
    )

    if (!this.isInteractive) {
      Object.entries(this.propertiesDefinitions).forEach(([key, val]) => {
        if (!val.isMandatory) {
          log.info(`- ${key}=${String(substitutionsVariables[key])}`)
        }
      })
      log.info()
    }

    log.debug(`from='${this.templatesPath}'`)
    console.log(`from='${this.templatesPath}'`)
    log.trace(util.inspect(substitutionsVariables))

    // ------------------------------------------------------------------------
    // Generate the application files.

    await fs.mkdir(config.cwd, { recursive: true })

    await this.render({
      sourceFilePath: 'include/hello-world-liquid.h',
      destinationFilePath: 'include/hello-world.h',
    })
    await this.render({
      sourceFilePath: `src/hello-world-liquid.${fileExtension}`,
      destinationFilePath: `src/hello-world.${fileExtension}`,
    })

    await this.render({
      sourceFilePath: 'libs/adder/include/add/add-liquid.h',
      destinationFilePath: 'libs/adder/include/add/add.h',
    })
    await this.render({
      sourceFilePath: 'libs/adder/src/add-liquid.c',
      destinationFilePath: 'libs/adder/src/add.c',
    })

    if (matrix.buildGenerator === 'cmake') {
      await this.render({
        sourceFilePath: 'cmake/toolchains/clang-liquid.cmake',
        destinationFilePath: 'cmake/toolchains/clang.cmake',
      })
      await this.render({
        sourceFilePath: 'cmake/toolchains/gcc-liquid.cmake',
        destinationFilePath: 'cmake/toolchains/gcc.cmake',
      })
      await this.render({
        sourceFilePath: 'CMakeLists-liquid.txt',
        destinationFilePath: 'CMakeLists.txt',
      })
    } else if (matrix.buildGenerator === 'meson') {
      await this.render({
        sourceFilePath: 'meson-liquid.build',
        destinationFilePath: 'meson.build',
      })
      await this.copyFolder({
        sourceFolderRelativePath: 'meson',
        destinationFolderPath: 'meson',
      })
      await this.render({
        sourceFilePath: 'libs/meson-liquid.build',
        destinationFilePath: 'libs/meson.build',
      })
      await this.render({
        sourceFilePath: 'libs/adder/meson-liquid.build',
        destinationFilePath: 'libs/adder/meson.build',
      })
    } else {
      // autotools
      await this.copyFile({
        sourceFileRelativePath: 'autotools/configure',
        destinationFilePath: 'autotools/configure',
      })
      await this.copyFile({
        sourceFileRelativePath:
          'autotools/make-template/libs/adder/src/folder.mk',
        destinationFilePath: 'autotools/make-template/libs/adder/src/folder.mk',
      })
      await this.render({
        sourceFilePath: 'autotools/make-template/src/folder-liquid.mk',
        destinationFilePath: 'autotools/make-template/src/folder.mk',
      })
      await this.render({
        sourceFilePath: 'autotools/make-template/makefile-liquid',
        destinationFilePath: 'autotools/make-template/makefile',
      })
      await this.copyFile({
        sourceFileRelativePath: 'a.vscode/c_cpp_properties-autotools.json',
        destinationFilePath: '.vscode/c_cpp_properties.json',
      })
    }

    await this.copyFile({
      sourceFileRelativePath: 'a.vscode/tasks.json',
      destinationFilePath: '.vscode/tasks.json',
    })
    await this.copyFile({
      sourceFileRelativePath: 'a.vscode/settings.json',
      destinationFilePath: '.vscode/settings.json',
    })
    // The source name must not interfere with npm.
    await this.copyFile({
      sourceFileRelativePath: 'a.gitignore',
      destinationFilePath: '.gitignore',
    })
    await this.copyFile({
      sourceFileRelativePath: 'a.npmignore',
      destinationFilePath: '.npmignore',
    })

    await this.render({
      sourceFilePath: 'README-liquid.md',
      destinationFilePath: 'README.md',
    })
    await this.render({
      sourceFilePath: 'LICENSE-liquid',
      destinationFilePath: 'LICENSE',
    })

    // Make this the last one, so if something goes wrong it will be
    // easier to retry.
    await this.render({
      sourceFilePath: 'package-liquid.json',
      destinationFilePath: 'package.json',
    })
  }
}

// ----------------------------------------------------------------------------
