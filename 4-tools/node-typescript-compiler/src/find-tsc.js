'use strict'

const path = require('path')
const path_exists = require('path-exists')
const os = require('os')

const { LIB } = require('./consts')


function find_tsc() {
	// obvious candidate from sibling module,
	// but won't work if symlinked, with npm link for ex. or with npm-pkgr
	const candidate_from_sibling_module = path.join(__dirname, '../typescript/bin/tsc')

	// second try: should work even if module is symlinked
	const candidate_from_caller_node_module = path.join(process.cwd(), 'node_modules/typescript/bin/tsc')

	// 3rd
	let candidate_from_require = null
	try {
		candidate_from_require = path.dirname(require.resolve('typescript'))
		candidate_from_require = path.join(candidate_from_require, '..', 'bin/tsc')
	}
	catch(err) { /* not found, ignore */ }

	// last try: fallbacking to an eventual global typescript module
	const candidate_from_global = path.join(os.homedir(), '.nvm/versions/node/', process.version, 'bin/tsc')


	function candidate_if_exists(candidate) {
		return path_exists(candidate)
			.then(exists => {
				if (!exists) throw new Error(`Couldn’t find "${candidate}"`)
				return candidate
			})
	}

	return candidate_if_exists(candidate_from_sibling_module)
		.catch(() => candidate_if_exists(candidate_from_caller_node_module))
		.catch(() => candidate_if_exists(candidate_from_require))
		.catch(() => candidate_if_exists(candidate_from_global))
		.catch(() => {
			console.error(`${LIB}: Couldn’t find a typescript compiler in any expected locations. Unsuccessfully tested locations, by priority:
- ${candidate_from_sibling_module}
- ${candidate_from_caller_node_module}
- ${candidate_from_require} (from require('typescript'))
- ${candidate_from_global}
			`)
			throw new Error(`Couldn’t find a typescript compiler in any expected locations!`)
		})
}

module.exports = {
	find_tsc,
}
