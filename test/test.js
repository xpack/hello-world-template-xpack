#!/usr/bin/env node
// Mandatory shebang must point to `node` and this file must be executable.

/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2021 Liviu Ionescu. All rights reserved.
 *
 * This Source Code File is subject to the MIT License terms.
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

const nodeBin = process.env.npm_node_execpath || process.env.NODE ||
  process.execPath
const executableRelativePath = '../bin/xpm-init-hello-world.js'

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
    this.startTime = Date.now()
    if (all) {
      shx.echo('Testing thoroughly...')
      for (const boardName of Object.keys(properties.boardName.items)) {
        for (const content of Object.keys(properties.content.items)) {
          for (const syscalls of Object.keys(properties.syscalls.items)) {
            for (const trace of Object.keys(properties.trace.items)) {
              for (const language of Object.keys(properties.language.items)) {
                for (const useNano of [false, true]) {
                  this.runOne({
                    boardName,
                    content,
                    syscalls,
                    trace,
                    language,
                    useSomeWarnings: true,
                    useMostWarnings: true,
                    useWerror: true,
                    useNano
                  })
                  this.count++
                }
              }
            }
          }
        }
      }
    } else {
      shx.echo('Testing selected cases...')
      for (const boardName of Object.keys(properties.boardName.items)) {
        for (const language of Object.keys(properties.language.items)) {
          this.runOne({
            boardName,
            content: properties.content.default,
            syscalls: properties.syscalls.default,
            trace: properties.trace.default,
            language,
            useSomeWarnings: true,
            useMostWarnings: true,
            useWerror: true,
            useNano: true
          })
          this.count++
        }
      }
    }

    const durationString = this.formatDuration(Date.now() - this.startTime)
    shx.echo(`Completed in ${durationString}.`)
  }

  runOne (props) {
    // https://www.npmjs.com/package/shelljs

    shx.set('-e') // Exit upon error

    const cnt = ('0000' + this.count).slice(-3)
    const name = `${cnt}-${props.boardName}-${props.content}-` +
        `${props.syscalls}-${props.trace}-${props.language}`

    shx.echo()
    shx.echo(`Testing '${name}'...`)

    const tmp = shx.tempdir()
    const buildFolder = `${tmp}/sifive-templates/${name}`

    shx.rm('-rf', buildFolder)
    shx.mkdir('-p', buildFolder)

    shx.config.silent = true
    shx.pushd(buildFolder)
    shx.config.silent = false

    const executableAbsolutePath = path.join(__dirname, executableRelativePath)

    let xpmInit = `"${nodeBin}" "${executableAbsolutePath}" --name ${cnt}`
    for (const [key, value] of Object.entries(props)) {
      xpmInit += ` --property ${key}=${value}`
    }
    // shx.echo(`$ ${xpmInit}`)
    shx.exec(xpmInit)

    shx.echo()
    let cmd = 'xpm install'
    shx.echo(`$ ${cmd}`)
    shx.exec(cmd)

    shx.echo()
    cmd = 'xpm run build'
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
