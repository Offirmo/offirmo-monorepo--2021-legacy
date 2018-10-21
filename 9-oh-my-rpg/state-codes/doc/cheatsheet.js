const stylize_string = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { ItemQuality } from '${stylize_string.bold(PKG_JSON.name)}'

ItemQuality.${stylize_string.green('common')}
ItemQuality.${stylize_string.blue('rare')}
ItemQuality.${stylize_string.magenta('epic')}
ItemQuality.${stylize_string.red('legendary')}
ItemQuality.${stylize_string.yellow('artifact')}
`.trim()))

