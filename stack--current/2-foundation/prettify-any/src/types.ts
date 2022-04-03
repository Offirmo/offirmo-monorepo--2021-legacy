
////////////////////////////////////

export interface StyleOptions {
	max_width: null | number // max width before need to wrap
	outline: boolean // add a strong separator at top and bottom so that it stands out
	indent: string // what should be used for indenting
	max_primitive_str_size: null | number
	should_recognize_constants: boolean
	should_recognize_globals: boolean
	quote: '\'' | '"'
	date_serialization_fn: string
}

// TODO find a better name
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

	prettify_any: (a: any, st: State) => string
}

export type Options = StyleOptions & StylizeOptions & PrettifyOptions

export interface State {
	o: Options

	circular: WeakSet<object>
}
