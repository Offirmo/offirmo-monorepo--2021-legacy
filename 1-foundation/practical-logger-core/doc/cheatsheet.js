const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
Using a generic logger: '${stylizeString.bold(PKG_JSON.name)}'

logger[level] = (message?: string, details?: Details) => void

logger.error('something happened!', { ... })
`.trim()))


