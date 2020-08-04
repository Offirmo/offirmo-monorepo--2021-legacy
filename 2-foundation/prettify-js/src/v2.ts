import stylize_string from 'chalk'

export interface Options {
	max_width: null | number // max width before need to wrap
	outline: boolean // add a strong separator at top and bottom so that it stands out
	indent: 'tabs' | number // number of spaces to use for indenting
	max_primitive_str_size: null | number
	should_recognize_constants: boolean
	should_recognize_globals: boolean
	quote: '\'' | '"'

	stylize_dim: (s: string) => string
	stylize_error: (s: string) => string
	stylize_global: (s: string) => string
	stylize_primitive: (s: string) => string
	stylize_syntax: (s: string) => string
	stylize_user: (s: string) => string

	prettify_string: (x: string, o: Options) => string
	prettify_number: (x: number, o: Options) => string
	prettify_bigint: (x: bigint, o: Options) => string
	prettify_boolean: (x: boolean, o: Options) => string
	prettify_undefined: (x: undefined, o: Options) => string
	prettify_symbol: (x: symbol, o: Options) => string

	prettify_function: (x: Function, o: Options, ox?: { as_prop?: boolean }) => string
	prettify_array: (x: Array<any>, o: Options) => string
	prettify_property_name: (x: string | number | symbol, o: Options) => string
	prettify_object: (x: Object, o: Options, ox?: { skip_constructor?: boolean }) => string

	prettify_any: (a: any, o: Options) => string
}

// https://2ality.com/2012/03/signedzero.html (outdated)
function is_negative_zero(x: number): boolean {
	return Object.is(x, -0)
}

function cmp<T>(a: T, b: T): number {
	return -(a < b) || +(a > b)
}

const DEFAULTS: Options = {
	max_width: null,
	outline: false,
	indent: 'tabs',
	max_primitive_str_size: null,
	should_recognize_constants: true,
	should_recognize_globals: true,
	quote: '\'',

	stylize_dim: (s: string) => stylize_string.dim(s),
	stylize_error: (s: string) => stylize_string.red.bold(s),
	stylize_global: (s: string) => stylize_string.magenta(s),
	stylize_primitive: (s: string) => stylize_string.green(s),
	stylize_syntax: (s: string) => stylize_string.yellow(s),
	stylize_user: (s: string) => stylize_string.blue(s),

	// TODO follow max string size
	prettify_string: (s: string, o: Options) => o.stylize_dim(o.quote) + o.stylize_user(s) + o.stylize_dim(o.quote),
	prettify_number: (n: number, o: Options) => {
		if (o.should_recognize_constants) {
			switch(n) {
				case Number.EPSILON: return o.stylize_global('Number.EPSILON')
				case Number.MAX_VALUE: return o.stylize_global('Number.MAX_VALUE')
				case Number.MIN_VALUE: return o.stylize_global('Number.MIN_VALUE')
				case Number.MAX_SAFE_INTEGER: return o.stylize_global('Number.MAX_SAFE_INTEGER')
				case Number.MIN_SAFE_INTEGER: return o.stylize_global('Number.MIN_SAFE_INTEGER')

				case Math.PI: return o.stylize_global('Math.PI')
				case Math.E: return o.stylize_global('Math.E')
				// no more Math, seldom used

				default:
					// fallback
			}
		}

		return isNaN(n)
			? o.stylize_error(String(n))
			: is_negative_zero(n)
				? o.stylize_error('-0')
				: o.stylize_primitive(String(n))
	},
	prettify_bigint: (b: bigint, o: Options) => o.stylize_primitive(String(b) + 'n'),
	prettify_boolean: (b: boolean, o: Options) => o.stylize_primitive(String(b)),
	prettify_undefined: (u: undefined, o: Options) => o.stylize_error(String(u)),
	prettify_symbol: (s: symbol, o: Options) => {
		return ''
			+ o.stylize_global('Symbol')
			+ o.stylize_syntax('(')
			+ (s.description ? o.prettify_string(s.description, o) : '')
			+ o.stylize_syntax(')')
	},

	prettify_function: (f: Function, o: Options, { as_prop = false } = {}) => {

		if (f.name && (globalThis as any)[f.name] === f) {
			return stylize_string.magenta(f.name)
		}

		let result = ''

		if (f.name) {
			if (!as_prop)
				result += o.stylize_syntax('function ')
			result += stylize_string.green(f.name)
		}

		result += o.stylize_syntax('()')
		result += o.stylize_syntax(f.name ? ' ' : ' => ')
		result += o.stylize_syntax('{')
		result += o.stylize_dim('\/\*…\*\/')
		result += o.stylize_syntax('}')

		return result
	},
	prettify_array: (a: Array<any>, o: Options) => {
		return o.stylize_syntax('[')
			+ a.map(e => o.prettify_any(e, o)).join(o.stylize_syntax(','))
			+ o.stylize_syntax(']')
	},
	prettify_object: (obj: Object, o: Options, { skip_constructor = false } = {}) => {
		if (obj === null) return o.stylize_primitive('null')
		if (Array.isArray(obj)) return o.prettify_array(obj, o)

		if (o.should_recognize_globals) {
			switch(obj) {
				case globalThis: return o.stylize_global('globalThis')

				default:
				// fallback
			}
		}

		if (!skip_constructor) {
			const p = Object.getPrototypeOf(obj)
			if (p && p.constructor && p.constructor.name) {
				// can we do better?
				if ((globalThis as any)[p.constructor.name] === p.constructor && p.constructor !== Object) {
					return o.stylize_syntax('new ')
						+ stylize_string.magenta(p.constructor.name)
						+ o.stylize_syntax('(')
						+ (() => {
							switch (p.constructor.name) {
								// all primitives that can be an Object
								case 'String':
									return o.prettify_string(obj as string, o)
								case 'Number':
									return o.prettify_number(obj as number, o)
								case 'Boolean':
									return o.prettify_boolean(obj as boolean, o)

								// recognize some objects
								case 'Set':
									return o.prettify_array(Array.from((obj as Set<any>).keys()), o)
								case 'WeakSet':
									return o.stylize_dim('/\*not enumerable*\/')

								// other
								default:
									if (p.constructor.name.endsWith('Error')) {
										const err: Error = obj as any
										// no need to pretty print it as copy/pastable to code,
										// 99.9% chance that's not what we want here
										return o.stylize_error(o.quote + err.message + o.quote)
									}
									return o.prettify_object(obj, o, { skip_constructor: true })
							}
						})()
						+ o.stylize_syntax(')')
				}
			}
		}

		const keys = Reflect.ownKeys(obj).sort((a: string | number | symbol, b: string | number | symbol) => {
			let res = cmp(typeof a, typeof b)

			if (res === 0) {
				res = cmp(a, b)
			}

			return res
		})

		if (keys.length === 0 && skip_constructor) {
			return o.stylize_dim('/\*???*\/')
		}

		return o.stylize_syntax('{')
			+ keys.map(k => {
				const v = (obj as any)[k]

				if (typeof v === 'function' && v.name === k)
					return o.prettify_function(v, o, { as_prop: true })

				return o.prettify_property_name(k, o)
					+ o.stylize_syntax(': ')
					+ o.prettify_any(v, o)
			}).join(o.stylize_syntax(','))
			+ o.stylize_syntax('}')
	},
	prettify_property_name: (p: string | number | symbol, o: Options) => {
		switch(typeof p) {
			case 'number':
				return o.prettify_number(p, o)
			case 'string': {
				// does it need to be quoted?
				// https://mathiasbynens.be/notes/javascript-properties
				return o.prettify_string(p, o)
			}
			case 'symbol':
				return o.stylize_syntax('[')
					+ o.prettify_symbol(p, o)
					+ o.stylize_syntax(']')
		}
	},

	prettify_any(any: any, o: Options): string {
		switch (typeof any) {

			/////// primitive type ///////
			case 'string':
				return o.prettify_string(any, o)
			case 'number':
				return o.prettify_number(any, o)
			case 'bigint':
				return o.prettify_bigint(any, o)
			case 'boolean':
				return o.prettify_boolean(any, o)
			case 'undefined':
				return o.prettify_undefined(any, o)
			case 'symbol':
				return o.prettify_symbol(any, o)

			/////// non-primitive type ///////
			case 'function': // special sub-type of object
				return o.prettify_function(any, o)
			case 'object':
				return o.prettify_object(any, o)


			default:
				return `[unsupported primitive type:${typeof any}]`
		}
	},
}

export function prettify_any(js: any, raw_options: Partial<Options> = {}): string {
	const o: Options = {
		...DEFAULTS,
		...raw_options,
	}

	return o.prettify_any(js, o)
}
