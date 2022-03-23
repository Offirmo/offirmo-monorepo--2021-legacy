// TODO use a proper logger

import { promises as fs } from 'node:fs'

import { LIB } from './consts'
const { version } = JSON.parse(await fs.readFile('../package.json'))


let banner = `[${LIB}] v${version}:`
export function set_banner(_banner = banner) {
	banner = _banner
}

let seen_any_output_yet = false
export function display_banner_if_1st_output() {
	if (seen_any_output_yet) return

	console.log(banner)

	seen_any_output_yet = true
}
