import {
	StyleOptions,
	PrettifyOptions,
	StylizeOptions,
	State,
} from './types'
import {
	is_negative_zero,
	cmp,
} from './utils'
import {get_options} from './options'
////////////////////////////////////////////////////////////////////////////////////

export const DEFAULTS_STYLE_OPTIONS: StyleOptions = {
	max_width: null,
	outline: false,
	indent: 'tabs',
	max_primitive_str_size: null,
	should_recognize_constants: true,
	should_recognize_globals: true,
	quote: '\'',
	date_serialization_fn: 'toLocaleString'
}

export const DEFAULTS_STYLIZE_OPTIONS__NONE: StylizeOptions = {
	stylize_dim: (s: string) => s,
	stylize_suspicious: (s: string) => s,
	stylize_error: (s: string) => s,
	stylize_global: (s: string) => s,
	stylize_primitive: (s: string) => s,
	stylize_syntax: (s: string) => s,
	stylize_user: (s: string) => s,
}

const DEBUG = false
export const DEFAULTS_PRETTIFY_OPTIONS: PrettifyOptions = {
	// TODO follow max string size

	// primitives
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
		try {
			return ''
				+ o.stylize_global('Symbol')
				+ o.stylize_syntax('(')
				+ (s.description ? o.prettify_string(s.description, st) : '')
				+ o.stylize_syntax(')')
		}
		catch (err) {
			return o.stylize_error(`[error prettifying:${(err as any)?.message}/ps]`)
		}
	},

	// objects
	prettify_function: (f: Function, st: State, { as_prop = false } = {}) => {
		const {o} = st

		if (f.name && (globalThis as any)[f.name] === f) {
			return o.stylize_user(f.name)
		}

		let result = ''

		if (f.name) {
			if (!as_prop) {
				// class detection may not work with Babel
				result += o.stylize_syntax(f.toString().startsWith('class ') ? 'class ' : 'function ')
			}

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
		if (DEBUG) console.log('prettify_array', a)
		st = {
			...st,
			circular: new Set([...Array.from(st.circular as any), a])
		}
		const { o } = st

		return o.stylize_syntax('[')
			+ a.map(e => o.prettify_any(e, st)) // NOTE when fully empty, map won't execute (but it looks nice, no pb)
				.join(o.stylize_syntax(','))
			+ o.stylize_syntax(']')
	},
	prettify_property_name: (p: string | number | symbol, st: State) => {
		const {o} = st

		try {
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
		}
		catch (err) {
			return o.stylize_error(`[error prettifying:${(err as any)?.message}/ppn]`)
		}
	},
	prettify_object: (obj: Object, st: State, { skip_constructor = false } = {}) => {
		if (DEBUG) console.log('prettify_object', obj)
		const { o } = st

		try {
			if (obj === null) return o.stylize_primitive('null')
			if (Array.isArray(obj)) return o.prettify_array(obj, st)

			if (o.should_recognize_globals) {
				try {
					switch(obj) {
						case globalThis: return o.stylize_global('globalThis')

						default:
						// fallback
					}
				}
				catch (err) {
					return o.stylize_error(`[error prettifying:${(err as any)?.message}/po.g]`)
				}
			}

			if (!skip_constructor) {
				try {
					const proto = Object.getPrototypeOf(obj)
					if (proto && proto.constructor && proto.constructor.name) {
						// can we do better?
						if (proto.constructor !== Object) {
							return o.stylize_syntax('new ')
								+ ((globalThis as any)[proto.constructor.name] === proto.constructor
									? o.stylize_global(proto.constructor.name)
									: o.stylize_user(proto.constructor.name)
								)
								+ o.stylize_syntax('(')
								+ (() => {
									switch (proto.constructor.name) {
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
										case 'Date':
											return o.stylize_dim(`/*${(obj as any)[o.date_serialization_fn]()}*/`)

										// node
										case 'Buffer':
											// too big!
											return '/*…*/'
										case 'Gunzip': // seen in fetch_ponyfill response
											// too big!
											return '/*…*/'

										// other
										default:
											if (proto.constructor.name.endsWith('Error')) {
												const err: Error = obj as any
												// no need to pretty print it as copy/pastable to code,
												// 99.9% chance that's not what we want here
												return o.stylize_error(o.quote + err.message + o.quote)
											}

											// Beware! This can turn into a huge thing, ex. a fetch response
											// REM we MUST have skip_constructor = true to avoid infinite loops
											return o.prettify_object(obj, st, { skip_constructor: true })
											//return '/*…*/'
									}
								})()
								+ o.stylize_syntax(')')
						}
					}
				}
				catch (err) {
					return o.stylize_error(`[error prettifying:${(err as any)?.message}/po.c]`)
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
				return o.stylize_dim(`/*${obj.toString()}*/`)
			}

			st = {
				...st,
				circular: new Set([...Array.from(st.circular as any), obj])
			}

			return o.stylize_syntax('{')
				+ keys.map(k => {
					const v = (obj as any)[k]

					if (typeof v === 'function' && v.name === k)
						return o.prettify_function(v, st, { as_prop: true })

					return o.prettify_property_name(k, st)
						+ o.stylize_syntax(': ')
						+ o.prettify_any(v, st)
				}).join(o.stylize_syntax(','))
				+ o.stylize_syntax('}')
		}
		catch (err) {
			return o.stylize_error(`[error prettifying:${(err as any)?.message}/po]`)
		}
	},

	// root
	prettify_any(any: any, st: State): string {
		if (DEBUG) console.log('prettify_any', any)
		const { o } = st

		try {
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
							return Array.isArray(any)
								? o.stylize_error('[<Circular ref!>]')
								: o.stylize_error('{<Circular ref!>}')
					}
					return o.prettify_object(any, st)
				}

				default:
					return `[unsupported type:${typeof any}]`
			}
		}
		catch (err) {
			return o.stylize_error(`[error prettifying:${(err as any)?.message}/pa]`)
		}
	},
}
