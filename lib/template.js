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

const fsPromises = require('fs').promises
const path = require('path')
const readline = require('readline')
const util = require('util')

// https://www.npmjs.com/package/cp-file
const cpFile = require('cp-file')

// https://www.npmjs.com/package/liquidjs
const { Liquid } = require('liquidjs')

// https://www.npmjs.com/package/make-dir
const makeDir = require('make-dir')

const { CliExitCodes, CliError } = require('@ilg/cli-start-options')

// ----------------------------------------------------------------------------

// Provided:
// language (c, c++)
// buildGenerator (cmake, meson)

// Computed:
// fileExtension (c, cpp)

// ============================================================================

// The result is in the properties map:
// context.config.properties[key] = value
// The description is shown when '?' is entered as selection.

const propertiesDefinitions = {
  language: {
    label: 'Programming language',
    description: 'Select the preferred programming language',
    type: 'select',
    items: {
      c: 'C for the application files',
      cpp: 'C++ for the application files'
    },
    default: 'c',
    isMandatory: true
  },
  buildGenerator: {
    label: 'Build Generator',
    description: 'Select the tool to generate the builds',
    type: 'select',
    items: {
      cmake: 'The CMake system build generator',
      meson: 'The Meson Build system'
    },
    default: 'cmake'
  }
}

// ============================================================================

// export
class XpmInitTemplate {
  // --------------------------------------------------------------------------

  constructor (context) {
    this.context = context
    this.log = context.log
  }

  async run () {
    const log = this.log
    log.trace(`${this.constructor.name}.run()`)

    log.info()

    const context = this.context
    const config = context.config

    let isError = false
    for (const [key, val] of Object.entries(config.properties)) {
      const value = this.validateValue(key, val)
      if (value === undefined) {
        log.error(`Unsupported property '${key}'`)
        isError = true
      }
      if (value === null) {
        log.error(`Unsupported value for '${key}=${val}'`)
        isError = true
      }
    }
    if (isError) {
      return CliExitCodes.ERROR.SYNTAX
    }

    // Properties set by `--property name=value` are in `config.properties`.

    // If there is at least one mandatory property without an explicit value,
    // enter the interractive mode and ask for the missing values.

    const mustAsk = Object.keys(propertiesDefinitions).some(
      (key) => {
        return (propertiesDefinitions[key].isMandatory &&
          !config.properties[key])
      }
    )

    let isInteractive
    if (mustAsk) {
      // Need to ask for more values.
      if (!(process.stdin.isTTY && process.stdout.isTTY)) {
        log.error('Interractive mode not possible without a TTY.')
        return CliExitCodes.ERROR.SYNTAX
      }

      await this.askForMoreValues()
      log.trace(util.inspect(config.properties))

      // Reset start time to skip interactive time.
      context.startTime = Date.now()
      isInteractive = true
    } else {
      // Properties without explicit values get their defaults.
      Object.entries(propertiesDefinitions).forEach(
        ([key, val]) => {
          if (!config.properties[key] && val.default) {
            config.properties[key] = val.default
          }
        }
      )
      isInteractive = false
    }

    // Copy all available values in the map used for substitutions.
    const liquidMap = { ...config.properties }

    liquidMap.projectName = config.projectName
    liquidMap.fileExtension = liquidMap.language

    const currentTime = new Date()
    liquidMap.year = currentTime.getFullYear().toString()

    // TODO: get this from git conifg.
    liquidMap.author = {
      name: 'my name',
      email: 'my@eMail.com',
      url: 'https://my-url'
    }

    liquidMap.githubId = 'my-github-id'

    await this.generate(liquidMap, isInteractive)

    return CliExitCodes.SUCCESS
  }

  validateValue (name, value) {
    const propDef = propertiesDefinitions[name]
    if (!propDef) {
      return undefined
    }
    if (propDef.type === 'select') {
      if (propDef.items[value]) {
        return value
      }
    } else if (propDef.type === 'boolean') {
      if (value === 'true') {
        return true
      } else if (value === 'false') {
        return false
      }
    }
    if (value === '') {
      return propDef.default
    }
    return null
  }

  async askForMoreValues (names) {
    const context = this.context
    const config = context.config

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // https://nodejs.org/docs/latest-v10.x/api/readline.html#readline_rl_question_query_callback
    rl.questionPromise = function (query) {
      return new Promise((resolve) => {
        rl.question(query, (answer) => {
          return resolve(answer)
        })
      })
    }

    for (const name of Object.keys(propertiesDefinitions)) {
      if (config.properties[name]) {
        continue
      }
      const val = propertiesDefinitions[name]
      let out = `${val.label}?`
      if (val.type === 'select') {
        out += ' (' + Object.keys(val.items).join(', ') + ', ?)'
      } else if (val.type === 'boolean') {
        out += ' (true, false, ?)'
      }
      if (val.default !== undefined) {
        out += ` [${val.default}]`
      }
      out += ': '

      while (true) {
        let answer = await rl.questionPromise(out)
        // No need for more trimming
        answer = this.validateValue(name, answer)
        if (answer != null && answer !== undefined) {
          // Store the answer in the configuration.
          config.properties[name] = answer
          break
        }
        console.log(val.description)
        if (val.type === 'select') {
          for (const [ikey, ival] of Object.entries(val.items)) {
            console.log(`- ${ikey}: ${ival}`)
          }
        }
      }
    }
  }

  async copyFile (source, destination = source) {
    const log = this.log

    await makeDir(path.dirname(destination))

    await cpFile(path.resolve(this.templatesPath, source), destination)
    log.info(`File '${destination}' copied.`)
  }

  async render (inputFileRelativePath, outputFileRelativePath, map) {
    const log = this.log

    log.trace(`render(${inputFileRelativePath}, ${outputFileRelativePath})`)

    await makeDir(path.dirname(outputFileRelativePath))

    // const headerPath = path.resolve(codePath, `${pnam}.h`)
    try {
      const fileContent =
        await this.engine.renderFile(inputFileRelativePath, map)

      await fsPromises.writeFile(outputFileRelativePath, fileContent, 'utf8')
    } catch (err) {
      throw new CliError(err.message, CliExitCodes.ERROR.OUTPUT)
    }
    log.info(`File '${outputFileRelativePath}' generated.`)
  }

  async generate (liquidMap, isInteractive) {
    const log = this.log
    const context = this.context
    const config = context.config

    const lang = (liquidMap.language === 'cpp') ? 'C++' : 'C'
    log.info()
    log.info(`Creating the ${lang} project '${liquidMap.projectName}'...`)

    if (!isInteractive) {
      log.info(`- BuildGenerator=${liquidMap.buildGenerator}`)
      log.info()
    }

    this.templatesPath = path.resolve(__dirname, '..', 'assets', 'sources')
    log.debug(`from='${this.templatesPath}'`)

    // https://liquidjs.com
    this.engine = new Liquid({
      root: this.templatesPath,
      cache: false,
      strictFilters: true, // default: false
      strictVariables: true, // default: false
      trimTagRight: false, // default: false
      trimTagLeft: false, // default: false
      greedy: false
    })

    const fileExtension = liquidMap.fileExtension

    log.trace(util.inspect(liquidMap))

    // ------------------------------------------------------------------------
    // Generate the application files.

    await makeDir(config.cwd)

    await this.copyFile('.clang-format')

    await this.render('LICENSE.liquid', 'LICENSE', liquidMap)
    await this.render('package-liquid.json', 'package.json', liquidMap)
    await this.render('README-liquid.md', 'README.md', liquidMap)

    await this.copyFile('include/hello-world.h')
    await this.copyFile(`src/hello-world.${fileExtension}`)

    await this.copyFile('libs/adder/include/add/add.h')
    await this.copyFile('libs/adder/src/add.c')

    if (liquidMap.buildGenerator === 'cmake') {
      await this.render('meta/CMakeLists-liquid.txt', 'meta/CMakeLists.txt',
        liquidMap)
    } else if (liquidMap.buildGenerator === 'meson') {
      await this.render('meta/meson-liquid.build', 'meta/meson.build',
        liquidMap)
    }

    await this.copyFile('.vscode/tasks.json')
  }
}

// ----------------------------------------------------------------------------
// Node.js specific export definitions.

// By default, `module.exports = {}`.
// The Template class is added as a property to this object.

module.exports.properties = propertiesDefinitions
module.exports.XpmInitTemplate = XpmInitTemplate

// ----------------------------------------------------------------------------
