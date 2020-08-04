
export interface Options {
	max_width: null | number // max width before need to wrap
	outline: boolean // add a strong separator at top and bottom so that it stands out
	indent: 'tabs' | number // number of spaces to use for indenting
}

const DEFAULTS: Options = {
	max_width: null,
	outline: false,
	indent: 'tabs',
}

export function prettify_js(js: any, options: Partial<Options> = {}): string {
	options = {
		...DEFAULTS,
		...options,
	}


}
