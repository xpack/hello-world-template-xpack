#!/usr/bin/env node
// Mandatory shebang must point to `node` and this file must be executable.

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

const fs = require('fs')
const os = require('os')
const path = require('path')

// https://www.npmjs.com/package/shelljs
const shx = require('shelljs')

const properties = require('../lib/template.js').properties

// ----------------------------------------------------------------------------

// During development only.
const enableXpmLink = false

class Test {
  static start () {
    // Instantiate a new test.
    const test = new Test()
    process.exitCode = test.run(process.argv.length > 2 ? process.argv[2] : '')
  }

  constructor () {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
    const packageJsonContent = fs.readFileSync(packageJsonPath)
    const packageJson = JSON.parse(packageJsonContent.toString())

    this.packageName = packageJson.name
    this.tmpFolderName = this.packageName.split('/')[1]

    this.count = 1
  }

  run (complexity) {
    this.complexity = complexity

    // Uninstall possibly existing global package, to ensure the
    // test uses the current folder content.
    const uninstall =
      `xpm uninstall ${this.packageName} --global --ignore-errors`
    shx.echo(`$ ${uninstall}`)
    shx.exec(uninstall)

    let exitCode = 0

    this.startTime = Date.now()
    if (complexity === 'all') {
      shx.echo('Testing thoroughly...')
      for (const buildGenerator of
        Object.keys(properties.buildGenerator.items)) {
        for (const language of Object.keys(properties.language.items)) {
          for (const toolchain of Object.keys(properties.toolchain.items)) {
            if (toolchain === 'system' && os.platform() === 'win32') {
              continue
            }
            exitCode = this.runOne({
              buildGenerator,
              language,
              toolchain
            })
            if (exitCode !== 0) {
              return exitCode
            }
            this.count++
          }
        }
      }
    } else if (complexity === 'ci' || complexity === '') {
      shx.echo('Testing a selection of cases...')
      for (const buildGenerator of
        Object.keys(properties.buildGenerator.items)) {
        for (const language of Object.keys(properties.language.items)) {
          for (const toolchain of Object.keys(properties.toolchain.items)) {
            if (toolchain === 'system' && os.platform() === 'win32') {
              continue
            }
            exitCode = this.runOne({
              buildGenerator,
              language,
              toolchain
            })
            if (exitCode !== 0) {
              return exitCode
            }
            this.count++
          }
        }
      }
    } else if (complexity === 'develop') {
      shx.echo('Testing one development cases...')
      exitCode = this.runOne({
        buildGenerator: 'cmake',
        // buildGenerator: 'meson',
        // buildGenerator: 'autotools',
        language: 'cpp',
        // language: 'c',
        toolchain: 'gcc'
        // toolchain: 'clang'
        // toolchain: 'system'
      })
    }

    const durationString = this.formatDuration(Date.now() - this.startTime)
    shx.echo(`Completed in ${durationString}.`)
  }

  runOne (properties) {
    // https://www.npmjs.com/package/shelljs

    shx.set('-e') // Exit upon error

    const count = ('0000' + this.count).slice(-3)
    const name = `${count}-${properties.buildGenerator}-` +
      `${properties.language}-${properties.toolchain}`

    shx.echo()
    shx.echo(`Testing '${name}'...`)

    let buildFolder
    if (this.complexity === 'ci' && os.platform() === 'win32') {
      // On CI the path is too long, switch to a temporary folder.
      buildFolder = `${shx.tempdir()}/${name}`
    } else {
      buildFolder = `build/${name}`
    }
    shx.echo(buildFolder)

    shx.rm('-rf', buildFolder)
    shx.mkdir('-p', buildFolder)

    shx.config.silent = true
    shx.pushd(buildFolder)
    shx.config.silent = false

    const projectFolderPath = path.dirname(__dirname)

    let command = `xpm init --template "${projectFolderPath}" --name ${count}`
    for (const [key, value] of Object.entries(properties)) {
      command += ` --property ${key}=${value}`
    }
    if (this.complexity === 'develop') {
      command += ' -dd'
    }
    shx.echo(`$ ${command}`)
    shx.exec(command)

    shx.echo()
    command = 'xpm install'
    if (this.complexity !== 'develop') {
      command += ' --quiet'
    }
    shx.echo(`$ ${command}`)
    try {
      shx.exec(command)
    } catch (err) {
      shx.echo()
      return 1
    }

    if (enableXpmLink) {
      shx.echo()
      command = 'xpm run link-deps'
      shx.echo(`$ ${command}`)
      try {
        shx.exec(command)
      } catch (err) {
        shx.echo()
        return 1
      }
    }

    shx.echo()
    command = 'xpm run test-all'
    shx.echo(`$ ${command}`)
    try {
      shx.exec(command)
    } catch (err) {
      shx.echo()
      return 1
    }

    shx.config.silent = true
    shx.popd()
    shx.config.silent = false

    return 0
  }

  /**
   * @summary Convert a duration in ms to seconds if larger than 1000.
   * @param {number} n Duration in milliseconds.
   * @returns {string} Value in ms or sec.
   */
  formatDuration (n) {
    if (n < 1000) {
      return `${n} ms`
    }
    return `${(n / 1000).toFixed(3)} sec`
  }
}

Test.start()
