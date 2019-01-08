console.log('🧙️  Hello from update_build_variables.js!')

const path = require('path')
const write_json_file = require("write-json-file")

const { get_human_readable_UTC_timestamp_minutes } = require('../0-stdlib/timestamps')

/*********************/

const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json')
const { version: VERSION } = require(PACKAGE_JSON_PATH)
const PACKAGE_DIR = path.basename(path.resolve(process.cwd()))
const BUILD_DATE = get_human_readable_UTC_timestamp_minutes()

console.log('🧙️  Extracted variables:', {VERSION, PACKAGE_DIR, BUILD_DATE})

write_json_file(path.resolve(process.cwd(), './src/services/build.json'), {
	VERSION,
	BUILD_DATE,
})
