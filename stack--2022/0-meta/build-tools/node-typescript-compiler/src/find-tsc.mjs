'use strict'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

import { pathExists } from 'path-exists'

import { LIB, __dirname } from './consts.mjs'

export const EXECUTABLE = 'tsc'

export async function find_tsc(display_banner_if_1st_output) {

	// obvious candidate from sibling module,
	// but won't work if symlinked, with npm link for ex. or with npm-pkgr
	const candidate_from_sibling_module =
		path.join(__dirname, '..', 'typescript', 'bin', EXECUTABLE)

	// second try: should work even if module is symlinked
	const candidate_from_caller_node_module =
		path.join(process.cwd(), 'node_modules', 'typescript', 'bin', EXECUTABLE)

	// 3rd
	let candidate_from_import = null
	try {
		candidate_from_import = path.dirname(fileURLToPath(await import.meta.resolve('typescript')))
		candidate_from_import = path.join(candidate_from_import, '..', 'bin', EXECUTABLE)
	}
	catch(err) {
		/* not found, ignore */
		//console.log('from import', err)
	}

	// last try: defaulting to an eventual global typescript module
	// (using nvm on OSX)
	const candidate_from_global = path.join(os.homedir(), '.nvm', 'versions', 'node', process.version, 'bin', EXECUTABLE)
	// TODO other OSes?


	async function candidate_if_exists(candidate) {
		return pathExists(candidate)
			.then(exists => {
				if (!exists)
					throw new Error(`Couldn’t find candidate typescript compiler "${candidate}"!`)
				return candidate
			})
	}

	return candidate_if_exists(candidate_from_sibling_module)
		.catch(() => candidate_if_exists(candidate_from_caller_node_module))
		.catch(() => candidate_if_exists(candidate_from_import))
		.catch(() => candidate_if_exists(candidate_from_global))
		.catch(() => {
			display_banner_if_1st_output()
			console.error(`[${LIB}] ❌ Couldn’t find a typescript compiler ("${EXECUTABLE}") in any expected locations. Unsuccessfully tested locations, by priority:
- ${candidate_from_sibling_module} ❌ not found
- ${candidate_from_caller_node_module} ❌ not found
- ${candidate_from_import} (from require('typescript')) ❌ not found
- ${candidate_from_global} ❌ not found
`)
			throw new Error(`Couldn’t find the "${EXECUTABLE}" typescript compiler in any expected locations!`)
		})
}
