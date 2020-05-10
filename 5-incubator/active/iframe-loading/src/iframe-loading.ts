
import { extend_xoff, get_offirmo_extras } from '@offirmo-private/xoff'


import {
	LoaderConfig,
	Loader,
} from './types'

//console.log('iframe-loading.ts', { window })

export interface XOffExtension {
	loader: Loader
}

export const loader_noop: Loader = {
	configure() {},
	on_rsrc_loaded() {},
}

const loader_full = (window.parent as any).oᐧloader || (window as any).oᐧloader

const loader = loader_full || loader_noop
if (!loader_full) {
	console.warn('iframe-loading: loader not found, are you properly using the html template?')
}

extend_xoff<XOffExtension>({ loader })

export function get_loader(): Loader {
	return get_offirmo_extras<XOffExtension>().loader
}
