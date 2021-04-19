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

const path = require('path')

// https://www.npmjs.com/package/shx
const shx = require('shelljs')

const properties = require('../lib/template.js').properties

// ----------------------------------------------------------------------------

class Test {
  static start () {
    // Instantiate a new test.
    const test = new Test()
    if (process.argv.length > 2 && process.argv[2] === 'all') {
      test.run(true)
    } else {
      test.run(false)
    }
  }

  constructor () {
    this.count = 1
  }

  run (all = false) {
    // Uninstall possibly existing global package, to ensure the
    // test uses the current folder content.
    const uninstall = 'xpm uninstall -g @xpack/hello-world-template'
    shx.echo(`$ ${uninstall}`)
    shx.exec(uninstall)

    this.startTime = Date.now()
    if (all) {
      shx.echo('Testing thoroughly...')
      for (const buildGenerator of
        Object.keys(properties.buildGenerator.items)) {
        for (const language of Object.keys(properties.language.items)) {
          this.runOne({
            buildGenerator,
            language
          })
          this.count++
        }
      }
    } else {
      shx.echo('Testing selected cases...')
      for (const language of Object.keys(properties.language.items)) {
        this.runOne({
          buildGenerator: properties.buildGenerator.default,
          language
        })
        this.count++
      }
    }

    const durationString = this.formatDuration(Date.now() - this.startTime)
    shx.echo(`Completed in ${durationString}.`)
  }

  runOne (props) {
    // https://www.npmjs.com/package/shelljs

    shx.set('-e') // Exit upon error

    const cnt = ('0000' + this.count).slice(-3)
    const name = `${cnt}-${props.buildGenerator}-${props.language}`

    shx.echo()
    shx.echo(`Testing '${name}'...`)

    const tmp = shx.tempdir()
    const buildFolder = `${tmp}/hello-templates/${name}`
    shx.echo(buildFolder)

    shx.rm('-rf', buildFolder)
    shx.mkdir('-p', buildFolder)

    shx.config.silent = true
    shx.pushd(buildFolder)
    shx.config.silent = false

    const projectFolderPath = path.dirname(__dirname)

    let xpmInit = `xpm init --template "${projectFolderPath}" --name ${cnt}`
    for (const [key, value] of Object.entries(props)) {
      xpmInit += ` --property ${key}=${value}`
    }
    shx.echo(`$ ${xpmInit}`)
    shx.exec(xpmInit)

    shx.echo()
    let cmd = 'xpm install'
    shx.echo(`$ ${cmd}`)
    shx.exec(cmd)

    shx.echo()
    cmd = 'xpm run test'
    shx.echo(`$ ${cmd}`)
    shx.exec(cmd)

    shx.config.silent = true
    shx.popd()
    shx.config.silent = false
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
