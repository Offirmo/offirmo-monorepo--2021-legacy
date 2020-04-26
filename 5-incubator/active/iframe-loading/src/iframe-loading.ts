
//console.log('iframe-loading.ts', { window })

export type CSSColor = string

export interface LoaderConfig {
	legend: string
	expected_rsrc_count: number
	bg_color: CSSColor
	fg_color: CSSColor
}

export interface Loader {
	configure(config: Partial<LoaderConfig>): void
	on_rsrc_loaded(id?: string): void
}

export const loader_noop: Loader = {
	configure(config: Partial<LoaderConfig>) {},
	on_rsrc_loaded(id?: string) {},
}

//////////// XOFF snippet ////////////
// Firefox ESL compatible
window.XOFF = {
	top_frame: window.parent,
	loader: loader_noop,
	flags: {},
	...window.parent.XOFF,
}
window.XOFF.flags = {
	debug_render: false,
	...window.XOFF.flags,
}
////////////////////////////////////

export const loader = (window as any).XOFF.loader
