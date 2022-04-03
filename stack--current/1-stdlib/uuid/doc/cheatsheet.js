const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

const {
	generate_uuid,
} = require('..')

console.log(boxify(`
"${stylizeString.bold(PKG_JSON.name)}": "^0",

import { UUID, generate_uuid } from '${stylizeString.bold(PKG_JSON.name)}'

generate_uuid()  "${generate_uuid()}"
`.trim()))
