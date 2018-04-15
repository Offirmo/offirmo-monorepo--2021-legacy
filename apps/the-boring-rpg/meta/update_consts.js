const fs = require('@offirmo/cli-toolbox/fs/extra')
const { get_human_readable_UTC_timestamp_minutes } = require('@offirmo/timestamps')

const package_json = require('../package.json')

const { version: VERSION } = package_json

console.log({VERSION})

const CONSTS_JS_PATH = './src/services/consts.js'
const consts_original_content = fs.readFileSync(CONSTS_JS_PATH, {encoding: 'utf8'})

const SEPARATOR = '/////// autogen ///////'
const parts = consts_original_content.split(SEPARATOR)

const consts_new_content = [
	parts[0],
	`
// do not edit this area, it is auto-generated
const VERSION='${VERSION}'
const BUILD_DATE='${get_human_readable_UTC_timestamp_minutes()}'
// TODO commit
`,
	parts[2],
].join(SEPARATOR)

//console.log(consts_new_content)

fs.writeFileSync(CONSTS_JS_PATH, consts_new_content, {encoding: 'utf8'})
