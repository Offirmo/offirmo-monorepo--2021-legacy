// Firefox ESL compatible

////////////////////////////////////

export interface OffirmoExtras {
	top_win: Window

	// flags
	flag⁚debug_render: true,
}

//////////// XOFF snippet ////////////

const PROP = 'xoff'

;(window as any)[PROP] = {
	top_win: window.parent,

	flag⁚debug_render: false,

	...(window as any)[PROP] as OffirmoExtras, // in case this code was already executed
	...(window.parent as any)[PROP] as OffirmoExtras, // inherit from parent
} as OffirmoExtras

////////////////////////////////////

export function extend_xoff<T>(defaults: T): T {
	const res = (window as any)[PROP] = {
		...defaults,
		...(window as any)[PROP] as OffirmoExtras,
		//...(window.parent as any)[PROP] as OffirmoExtras, // useful?
	} as OffirmoExtras & T

	return res as T
}

export function get_offirmo_extras<T = {}>(): OffirmoExtras & T {
	return (window as any)[PROP]
}

export function get_top_window(): Window {
	return get_offirmo_extras().top_win
}
