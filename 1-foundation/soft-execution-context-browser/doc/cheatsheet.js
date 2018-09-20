const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { TODO } from '${stylizeString.bold(PKG_JSON.name)}'

TODO
`.trim()))
