const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')
const columnify = require('@offirmo/cli-toolbox/string/columnify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { createLogger } from '${stylizeString.bold(PKG_JSON.name)}'
`.trim()))
