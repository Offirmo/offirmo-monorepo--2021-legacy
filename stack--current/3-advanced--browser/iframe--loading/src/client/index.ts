import { extend_xoff, get_xoff } from '@offirmo-private/xoff'

import {
	LoaderConfig,
	Loader,
} from './types'

/////////////////////

export interface XOffExtension {
	loader: Loader
}

const LIB = '🖼 iframe-loading'
export const PROP = 'oᐧloader'

/////////////////////
//console.log('iframe-loading.ts', { window })

export const loader_fallback: Loader = {
	// never hurt to try...
	configure(...args) {
		window.parent.postMessage(
			{ [PROP]: { method: 'configure', args}},
			'*'
		)
	},
	on_rsrc_loaded(...args) {
		window.parent.postMessage(
			{ [PROP]: { method: 'on_rsrc_loaded', args}},
			'*'
		)
	},
}

let loader_full
try { loader_full = (window.parent as any)[PROP] } catch {}
loader_full = loader_full || (window as any)[PROP]
if (!loader_full) {
	const url = new URL(window.location.href)
	const { searchParams } = url
	const hint_at_loader = searchParams.has(PROP)
	if (!hint_at_loader)
		console.info(`[${LIB}] loader not found` + (url.hostname === 'localhost' ? ' but looks like dev mode ✔' : ', are you properly set up?'))
	else
		console.info(`[${LIB}] loader not found or cross-domain, will postMessage().`)
}

const loader = loader_full || loader_fallback

extend_xoff<XOffExtension>({ loader })

export function get_loader(win: Window = window): Loader {
	return get_xoff<XOffExtension>(win).loader
}

export default get_loader
