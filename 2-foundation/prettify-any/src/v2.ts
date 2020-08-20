import {
	Options,
	State,
} from './types'
import { get_options } from './options'

////////////////////////////////////

function create_state(options: Options): State {
	return {
		o: get_options(options),

		circular: new WeakSet<object>()
	}
}

export function prettify_any(js: Readonly<any>, options: Readonly<Partial<Options>> = {}): string {
	try {
		const st = create_state(get_options(options))

		return st.o.prettify_any(js, st)
	}
	catch (err) {
		return `[error prettifying:${err.message}]`
	}
}

export function prettify_json(js: Readonly<any>, options: Readonly<Partial<Options>> = {}): string {
	const st = create_state(get_options(options))

	// TODO show not JSON
	return st.o.prettify_any(js, st)
}

export function dump_prettified_any(msg: string, data: Readonly<any>, options: Readonly<Partial<Options>> = {}): void {
	console.log(msg)
	console.log(prettify_any(data, options))
}


export function is_pure_json(js: Readonly<any>): boolean {
	return false
}
