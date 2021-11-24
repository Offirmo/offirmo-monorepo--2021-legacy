console.log('🧙️  Hello from update_build_variables.js!')

const path = require('path')

const semver = require('semver')
const assert = require('tiny-invariant')
const write_json_file = require('write-json-file')
const meow = require('../3-advanced--node/cli-toolbox/framework/meow')
const fs = require('../3-advanced--node/cli-toolbox/fs/extra')

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
			default: path.resolve(process.cwd(), './src'),
		},
	},
})


// ex. 20181121_06h00
function get_human_readable_UTC_timestamp_minutes(now = new Date()) {
	const YYYY = now.getUTCFullYear()
	const MM = String(now.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(now.getUTCDate()).padStart(2, '0')
	const hh = String(now.getUTCHours()).padStart(2, '0')
	const mm = String(now.getUTCMinutes()).padStart(2, '0')

	return `${YYYY}${MM}${DD}_${hh}h${mm}`
}

/////////////////////

//console.log('🐈  meow', cli.flags)

const PACKAGE_JSON_PATH = path.resolve(cli.flags.inputDir || process.cwd(), './package.json')
let { version: VERSION, name: NAME } = require(PACKAGE_JSON_PATH)
const BUILD_DATE = get_human_readable_UTC_timestamp_minutes()

//console.log('🧙️  mode:', cli.flags.mode)
console.log(`🧙️  Extracted variables for module ${NAME}:`, { VERSION, BUILD_DATE })

VERSION = semver.clean(VERSION)
assert(VERSION, 'cleaned VERSION')

function to_numver(str) {
	const PARSED_VERSION = semver.parse(str)
	assert(PARSED_VERSION.minor < 100, 'minor too big for numerical version!!!')
	assert(PARSED_VERSION.patch < 100, 'patch too big for numerical version!!!')

	return Number(`${PARSED_VERSION.major}.${String(PARSED_VERSION.minor).padStart(2, '0')}${String(PARSED_VERSION.patch).padStart(2, '0')}`)
}
assert(to_numver('1.2.3') === 1.0203, '1.2.3')
assert(to_numver('2.0.0') === 2., '2.0.0')
assert(to_numver('345.67.89') === 345.6789, '345.67.89')
const NUMERIC_VERSION = to_numver(VERSION)


console.log('🧙️  Derived variables:', { VERSION, NUMERIC_VERSION })

switch(cli.flags.mode || 'json') {
	case 'json': {
		const target_path = path.resolve(cli.flags.outputDir || process.cwd(), './build.json')
		write_json_file(target_path, {
			VERSION,
			NUMERIC_VERSION,
			BUILD_DATE,
		})
		console.log('🧙️  wrote:', target_path)
		break
	}
	case 'ts': {
		const target_path = path.resolve(cli.flags.outputDir || process.cwd(), './build.ts')
		fs.writeFileSync(target_path, `
// THIS FILE IS AUTO GENERATED!
export const VERSION: string = '${VERSION}'
export const NUMERIC_VERSION: number = ${NUMERIC_VERSION} // for easy comparisons
export const BUILD_DATE: string = '${BUILD_DATE}'
`)
		console.log('🧙️  wrote:', target_path)
		break
	}
	case 'node': {
		const target_path = path.resolve(cli.flags.outputDir || process.cwd(), './build.js')
		fs.writeFileSync(target_path, `
// THIS FILE IS AUTO GENERATED!
const VERSION = '${VERSION}'
const NUMERIC_VERSION = ${NUMERIC_VERSION} // for easy comparisons
const BUILD_DATE = '${BUILD_DATE}'
module.exports = { VERSION, NUMERIC_VERSION, BUILD_DATE }
`)
		console.log('🧙️  wrote:', target_path)
		break
	}
	default:
		throw new Error('Unrecognized mode!')
}

// always add a build badge as well
// intended usage: https://shields.io/endpoint
let target_path = path.resolve(cli.flags.outputDir || process.cwd(), './build_badge_version.json')
write_json_file(target_path, {
	// Note: no undocumented properties are allowed!
	// required:
	"schemaVersion": 1,
	"label": "version",
	"message": VERSION,
	// optional:
})
console.log('🧙️  wrote:', target_path)

target_path = path.resolve(cli.flags.outputDir || process.cwd(), './build_badge_time.json')
write_json_file(target_path, {
	// Note: no undocumented properties are allowed!
	// required:
	"schemaVersion": 1,
	"label": "build date",
	"message": BUILD_DATE,
	// optional:
})
console.log('🧙️  wrote:', target_path)
