/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2021 Liviu Ionescu. All rights reserved.
 *
 * This Software is provided under the terms of the MIT License.
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT/.
 */

'use strict'

/**
 * This is the module entry point, the file that is processed when
 * `require('<module>')` is called.
 *
 * For this to work, it must be linked from `package.json` as
 * `"main": "./index.js",`, which is, BTW, the default behaviour.
 *
 * To import classes from this module into Node.js applications, use:
 *
 * ```javascript
 * import { XpmInitTemplate } from '<module>'
 * ```
 */

export { XpmInitTemplate } from './lib/template.js'

// ----------------------------------------------------------------------------
