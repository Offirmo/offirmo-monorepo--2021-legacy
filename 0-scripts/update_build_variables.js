console.log('🧙️  Hello from update_build_variables.js!')

const path = require('path')
const write_json_file = require('write-json-file')
const meow = require('meow')
const fs = require('fs-extra')
const semver = require('semver')
const assert = require('tiny-invariant')


const { get_human_readable_UTC_timestamp_minutes } = require('../1-stdlib/timestamps')

/////////////////////

const cli = meow('build', {
	flags: {
		mode: {
			type: 'string',
			default: 'json',
		},
		inputDir: {
			type: 'string',
			default: process.cwd(),
		},
		outputDir: {
			type: 'string',
			default: process.cwd(),
		},
	},
})

/////////////////////

//console.log('🐈  meow', cli.flags)

const PACKAGE_JSON_PATH = path.resolve(cli.flags.inputDir || process.cwd(), './package.json')
let { version: VERSION } = require(PACKAGE_JSON_PATH)
const BUILD_DATE = get_human_readable_UTC_timestamp_minutes()

//console.log('🧙️  mode:', cli.flags.mode)
console.log('🧙️  Extracted variables:', { VERSION, BUILD_DATE })

VERSION = semver.clean(VERSION)
assert(VERSION, 'cleaned VERSION')
const PARSED_VERSION = semver.parse(VERSION)
assert(PARSED_VERSION.minor < 100, 'minor too big for numerical version!!!')
const NUMERIC_VERSION = Number(`${PARSED_VERSION.major}${String(PARSED_VERSION.minor).padStart(2, '0')}.${PARSED_VERSION.patch}`)

console.log('🧙️  Derived variables:', { VERSION, NUMERIC_VERSION })

switch(cli.flags.mode || 'json') {
	case 'json': {
		const target_path = path.resolve(cli.flags.outputDir || process.cwd(), './src/build.json')
		write_json_file(target_path, {
			VERSION,
			NUMERIC_VERSION,
			BUILD_DATE,
		})
		console.log('🧙️  wrote:', target_path)
		break
	}
	case 'ts': {
		const target_path = path.resolve(cli.flags.outputDir || process.cwd(), './src/build.ts')
		fs.writeFileSync(target_path, `
// THIS FILE IS AUTO GENERATED!
export const VERSION: string = '${VERSION}'
export const NUMERIC_VERSION: number = ${NUMERIC_VERSION} // for easy comparisons
export const BUILD_DATE: string = '${BUILD_DATE}'
`);
		console.log('🧙️  wrote:', target_path)
		break
	}
	default:
		throw new Error('Unrecognized mode!')
}
