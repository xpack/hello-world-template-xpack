/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2021 Liviu Ionescu. All rights reserved.
 *
 * This Software is provided under the terms of the MIT License.
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT/.
 */

'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * The XpmInitTemplate module.
 *
 * It is re-exported publicly by `index.js`.
 * 'xpm init --template' imports it via the `main` property of `package.json`,
 * instantiates it with the current context, which includes the log and
 * the configurations, then invokes the `run()` method.
 */

// ----------------------------------------------------------------------------

import fs from 'fs'
import path from 'path'

import util from 'util'
import { fileURLToPath } from 'url'

// https://www.npmjs.com/package/make-dir
import makeDir from 'make-dir'

// https://www.npmjs.com/package/git-config-path
import getGitConfigPath from 'git-config-path'
// https://www.npmjs.com/package/parse-git-config
import parseGitConfig from 'parse-git-config'

import { XpmInitTemplateBase } from '@xpack/xpm-lib'

// ----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Provided:
// language (c, c++)
// buildGenerator (cmake, meson)

// Computed:
// fileExtension (c, cpp)

// ============================================================================

// The result is in the properties map:
// context.config.properties[key] = value
// The description is shown when '?' is entered as selection.

// ============================================================================

export class XpmInitTemplate extends XpmInitTemplateBase {
  // --------------------------------------------------------------------------

  constructor ({ context }) {
    super({
      context,
      templatesPath: path.resolve(__dirname, '..', 'assets', 'sources'),
      propertiesDefinitions: {
        language: {
          label: 'Programming language',
          description: 'Select the preferred programming language',
          type: 'select',
          items: {
            c: 'C for the application files',
            cpp: 'C++ for the application files'
          },
          default: 'cpp',
          isMandatory: true
        },
        buildGenerator: {
          label: 'Build System',
          description: 'Select the tool to generate the builds',
          type: 'select',
          items: {
            cmake: 'The CMake build system',
            meson: 'The Meson build system',
            autotools: 'Autotools configure & GNU make (legacy)'
          },
          default: 'cmake'
        },
        toolchain: {
          label: 'Toolchain',
          description: 'Select the toolchain to be used by the builds',
          type: 'select',
          items: {
            gcc: {
              // There is no gcc on macOS.
              platforms: ['linux', 'win32'],
              message: 'The xPack GNU Compiler Collection (GCC) toolchain'
            },
            clang: 'The xPack LLVM clang toolchain',
            system: {
              // There is no system toolchain on Windows.
              platforms: ['linux', 'darwin'],
              message: 'The system toolchain'
            }
          },
          default: 'clang'
        }
      }
    })
  }

  async generate (isInteractive) {
    const log = this.log
    const context = this.context
    const config = context.config

    const substitutionsVariables = this.substitutionsVariables

    const gitConfigPath = getGitConfigPath('global')
    const gitConfig = parseGitConfig.sync({ path: gitConfigPath }) || {}
    if (!gitConfig.user) {
      gitConfig.user = {}
    }

    log.trace(util.inspect(gitConfig))

    substitutionsVariables.author = {
      name: gitConfig.user.name ? gitConfig.user.name : 'my name',
      email: gitConfig.user.email ? gitConfig.user.email : 'my@eMail.com',
      url:
        gitConfig.user.email === 'ilg@livius.net'
          ? 'https://github.com/ilg-ul/'
          : 'https://my-url'
    }

    substitutionsVariables.githubId =
      gitConfig.user.email === 'ilg@livius.net' ? 'ilg-ul' : 'my-github-id'

    // Add package (for name & version)
    const packageJsonPath = path.resolve(
      path.dirname(this.__dirname),
      'package.json'
    )
    const packageJsonContent = await fs.readFile(packageJsonPath)
    const packageJson = JSON.parse(packageJsonContent.toString())
    substitutionsVariables.package = packageJson

    const lang = (substitutionsVariables.language === 'cpp') ? 'C++' : 'C'
    log.info(`Creating the ${lang} project ` +
      `'${substitutionsVariables.projectName}'...`)

    if (!isInteractive) {
      Object.entries(this.propertiesDefinitions).forEach(
        ([key, val]) => {
          if (!val.isMandatory) {
            log.info(`- ${key}=${substitutionsVariables[key]}`)
          }
        }
      )
      log.info()
    }

    log.debug(`from='${this.templatesPath}'`)

    log.trace(util.inspect(substitutionsVariables))

    // ------------------------------------------------------------------------
    // Generate the application files.

    const fileExtension = substitutionsVariables.fileExtension

    await makeDir(config.cwd)

    await this.copyFile('include/hello-world.h')
    await this.copyFile(`src/hello-world.${fileExtension}`)

    await this.copyFile('libs/adder/include/add/add.h')
    await this.copyFile('libs/adder/src/add.c')

    if (substitutionsVariables.buildGenerator === 'cmake') {
      await this.copyFolder('cmake')
      await this.render('CMakeLists-liquid.txt', 'CMakeLists.txt')
    } else if (substitutionsVariables.buildGenerator === 'meson') {
      await this.render('meson-liquid.build', 'meson.build')
      await this.copyFolder('meson')
      await this.copyFile('libs/meson.build')
      await this.render('libs/adder/meson-liquid.build',
        'libs/adder/meson.build')
    } else if (substitutionsVariables.buildGenerator === 'autotools') {
      await this.copyFile('autotools/configure')
      await this.copyFile('autotools/make-template/libs/adder/src/folder.mk')
      await this.render('autotools/make-template/src/folder-liquid.mk',
        'autotools/make-template/src/folder.mk')
      await this.render('autotools/make-template/makefile-liquid',
        'autotools/make-template/makefile')
      await this.copyFile('a.vscode/c_cpp_properties-autotools.json',
        '.vscode/c_cpp_properties.json')
    }

    await this.copyFile('a.vscode/tasks.json', '.vscode/tasks.json')
    await this.copyFile('a.vscode/settings.json', '.vscode/settings.json')
    // The source name must not interfere with npm.
    await this.copyFile('a.gitignore', '.gitignore')
    await this.copyFile('a.npmignore', '.npmignore')

    await this.render('README-liquid.md', 'README.md')
    await this.render('LICENSE.liquid', 'LICENSE')

    // Make this the last one, so if something goes wrong it will be
    // easier to retry.
    await this.render('package-liquid.json', 'package.json')
  }
}

// ----------------------------------------------------------------------------
