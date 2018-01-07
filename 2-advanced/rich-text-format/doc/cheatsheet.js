const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')
const columnify = require('@offirmo/cli-toolbox/string/columnify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { createLogger } from '${stylizeString.bold(PKG_JSON.name)}'
const logger = createLogger({
  name: 'FOO',
  level: 'silly',
})
`.trim()))




const { ALL_LOG_LEVELS, LEVEL_TO_INTEGER } = require('@offirmo/practical-logger-core')
const { LEVEL_TO_STYLIZE } = require('..')

const data = ALL_LOG_LEVELS.map(level => LEVEL_TO_STYLIZE[level](level))
console.log(boxify('Log levels:\n' + columnify(data, {
	sort: false,
	width: 70,
})))
