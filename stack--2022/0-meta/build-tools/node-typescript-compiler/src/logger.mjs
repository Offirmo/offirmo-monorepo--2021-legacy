// TODO use a proper logger

import path from 'node:path'
import { promises as fs } from 'node:fs'

import { LIB, __dirname } from './consts.mjs'

///////
const { version } = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json')))


const DEFAULT_BANNER = `[${LIB}] v${version}:`

export function create_logger_state(banner = DEFAULT_BANNER) {
	return {
		banner,
		seen_any_output_yet: false,
	}
}

export function display_banner_if_1st_output(logger_state) {
	if (!logger_state.seen_any_output_yet) {
		console.log(banner)
		logger_state = {
			...logger_state,
			seen_any_output_yet: true,
		}
	}

	return logger_state
}
