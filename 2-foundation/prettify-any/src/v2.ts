
////////////////////////////////////

export interface StyleOptions {
	max_width: null | number // max width before need to wrap
	outline: boolean // add a strong separator at top and bottom so that it stands out
	indent: string // what should be used for indenting
	max_primitive_str_size: null | number
	should_recognize_constants: boolean
	should_recognize_globals: boolean
	quote: '\'' | '"'
}

export interface StylizeOptions {
	stylize_dim: (s: string) => string
	stylize_suspicious: (s: string) => string
	stylize_error: (s: string) => string
	stylize_global: (s: string) => string
	stylize_primitive: (s: string) => string
	stylize_syntax: (s: string) => string
	stylize_user: (s: string) => string
}

export interface PrettifyOptions {
	prettify_string: (x: string, st: State) => string
	prettify_number: (x: number, st: State) => string
	prettify_bigint: (x: bigint, st: State) => string
	prettify_boolean: (x: boolean, st: State) => string
	prettify_undefined: (x: undefined, st: State) => string
	prettify_symbol: (x: symbol, st: State) => string

	prettify_function: (x: Function, st: State, ox?: { as_prop?: boolean }) => string
	prettify_array: (x: Array<any>, st: State) => string
	prettify_property_name: (x: string | number | symbol, st: State) => string
	prettify_object: (x: Object, st: State, ox?: { skip_constructor?: boolean }) => string

	to_prettified_str: (a: any, st: State) => string
}

export type Options = StyleOptions & StylizeOptions & PrettifyOptions

export interface State {
	o: Options

	circular: WeakSet<object>
}

const DEFAULTS_STYLE_OPTIONS: StyleOptions = {
	max_width: null,
	outline: false,
	indent: 'tabs',
	max_primitive_str_size: null,
	should_recognize_constants: true,
	should_recognize_globals: true,
	quote: '\'',
}

const DEFAULTS_PRETTIFY_OPTIONS: PrettifyOptions = {
	// TODO follow max string size
	prettify_string: (s: string, st: State) => {
		const { o } = st
		return o.stylize_dim(o.quote) + o.stylize_user(s) + o.stylize_dim(o.quote)
	},
	prettify_number: (n: number, st: State) => {
		const { o } = st
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
	prettify_bigint: (b: bigint, st: State) => {
		const { o } = st
		return o.stylize_primitive(String(b) + 'n')
	},
	prettify_boolean: (b: boolean, st: State) => {
		const {o} = st
		return o.stylize_primitive(String(b))
	},
	prettify_undefined: (u: undefined, st: State) => {
		const {o} = st
		return o.stylize_suspicious(String(u))
	},
	prettify_symbol: (s: symbol, st: State) => {
		const {o} = st
		return ''
			+ o.stylize_global('Symbol')
			+ o.stylize_syntax('(')
			+ (s.description ? o.prettify_string(s.description, st) : '')
			+ o.stylize_syntax(')')
	},

	prettify_function: (f: Function, st: State, { as_prop = false } = {}) => {
		const {o} = st

		if (f.name && (globalThis as any)[f.name] === f) {
			return o.stylize_user(f.name)
		}

		let result = ''

		if (f.name) {
			if (!as_prop)
				result += o.stylize_syntax('function ')
			result += o.stylize_user(f.name)
		}

		result += o.stylize_syntax('()')
		result += o.stylize_syntax(f.name ? ' ' : ' => ')
		result += o.stylize_syntax('{')
		result += o.stylize_dim('\/\*…\*\/')
		result += o.stylize_syntax('}')

		return result
	},
	prettify_array: (a: Array<any>, st: State) => {
		const {o} = st

		return o.stylize_syntax('[')
			+ a.map(e => o.to_prettified_str(e, st)).join(o.stylize_syntax(','))
			+ o.stylize_syntax(']')
	},
	prettify_property_name: (p: string | number | symbol, st: State) => {
		const {o} = st

		switch(typeof p) {
			case 'number':
				return o.prettify_number(p, st)
			case 'string': {
				// does it need to be quoted?
				// https://mathiasbynens.be/notes/javascript-properties
				return o.prettify_string(p, st)
			}
			case 'symbol':
				return o.stylize_syntax('[')
					+ o.prettify_symbol(p, st)
					+ o.stylize_syntax(']')
		}
	},
	prettify_object: (obj: Object, st: State, { skip_constructor = false } = {}) => {
		const {o} = st

		if (obj === null) return o.stylize_primitive('null')
		if (Array.isArray(obj)) return o.prettify_array(obj, st)

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
						+ o.stylize_global(p.constructor.name)
						+ o.stylize_syntax('(')
						+ (() => {
							switch (p.constructor.name) {
								// all primitives that can be an Object
								case 'String':
									return o.prettify_string(obj as string, st)
								case 'Number':
									return o.prettify_number(obj as number, st)
								case 'Boolean':
									return o.prettify_boolean(obj as boolean, st)

								// recognize some objects
								case 'Set':
									return o.prettify_array(Array.from((obj as Set<any>).keys()), st)
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
									return o.prettify_object(obj, st, { skip_constructor: true })
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
					return o.prettify_function(v, st, { as_prop: true })

				return o.prettify_property_name(k, st)
					+ o.stylize_syntax(': ')
					+ o.to_prettified_str(v, st)
			}).join(o.stylize_syntax(','))
			+ o.stylize_syntax('}')
	},

	to_prettified_str(any: any, st: State): string {
		const {o} = st

		switch (typeof any) {

			/////// primitive type ///////
			case 'string':
				return o.prettify_string(any, st)
			case 'number':
				return o.prettify_number(any, st)
			case 'bigint':
				return o.prettify_bigint(any, st)
			case 'boolean':
				return o.prettify_boolean(any, st)
			case 'undefined':
				return o.prettify_undefined(any, st)
			case 'symbol':
				return o.prettify_symbol(any, st)

			/////// non-primitive type ///////
			case 'function': // special sub-type of object
				return o.prettify_function(any, st)
			case 'object': {
				if (any !== null) {
					if (st.circular.has(any))
						return o.stylize_error('<Circular ref!>')
					st.circular.add(any)
				}
				return o.prettify_object(any, st)
			}


			default:
				return `[unsupported primitive type:${typeof any}]`
		}
	},
}

const DEFAULTS_STYLIZE_OPTIONS__NONE: StylizeOptions = {
	stylize_dim: (s: string) => s,
	stylize_suspicious: (s: string) => s,
	stylize_error: (s: string) => s,
	stylize_global: (s: string) => s,
	stylize_primitive: (s: string) => s,
	stylize_syntax: (s: string) => s,
	stylize_user: (s: string) => s,
}

function get_stylize_options_chalk_ansi(chalk: any): StylizeOptions {
	return {
		stylize_dim: (s: string) => chalk.dim(s),
		stylize_suspicious: (s: string) => chalk.bold(s),
		stylize_error: (s: string) => chalk.red.bold(s),
		stylize_global: (s: string) => chalk.magenta(s),
		stylize_primitive: (s: string) => chalk.green(s),
		stylize_syntax: (s: string) => chalk.yellow(s),
		stylize_user: (s: string) => chalk.blue(s),
	}
}

let default_options: Options = {
	...DEFAULTS_STYLE_OPTIONS,
	...DEFAULTS_PRETTIFY_OPTIONS,
	...DEFAULTS_STYLIZE_OPTIONS__NONE,
}

////////////////////////////////////

// https://2ality.com/2012/03/signedzero.html (outdated)
function is_negative_zero(x: number): boolean {
	return Object.is(x, -0)
}

// https://stackoverflow.com/a/51398944/587407
function cmp<T>(a: T, b: T): number {
	return -(a < b) || +(a > b)
}

////////////////////////////////////

export function to_prettified_str(js: Readonly<any>, options: Readonly<Partial<Options>> = {}): string {
	try {
		const st: State = {
			o: {
				...default_options,
				...options,
			},

			circular: new WeakSet<object>()
		}

		return st.o.to_prettified_str(js, st)
	}
	catch (err) {
		return `[error prettifying:${err.message}]`
	}
}

export function prettify_json(js: Readonly<any>, options: Readonly<Partial<Options>> = {}): string {
	const st: State = {
		o: {
			...default_options,
			...options,
		},

		circular: new WeakSet<object>()
	}

	return st.o.to_prettified_str(js, st)
}

export function dump_prettified_any(msg: string, data: Readonly<any>, options: Readonly<Partial<Options>> = {}): void {
	console.log(msg)
	console.log(to_prettified_str(data, options))
}

export function inject_chalk(chalk: any) {
	default_options = {
		...default_options,
		...get_stylize_options_chalk_ansi(chalk),
	}
}
