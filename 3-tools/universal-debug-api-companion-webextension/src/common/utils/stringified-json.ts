
export const JSON_UNDEFINED: string = 'undefined'
// use this alternative to better validate typings. Obviously won't work.
//export const JSON_UNDEFINED: unique symbol = Symbol('undefined')

export type StringifiedJSON = string | typeof JSON_UNDEFINED

export function sjson_parse(s: StringifiedJSON): any {
	if (s === JSON_UNDEFINED)
		return undefined

	return JSON.parse(s)
}

export function sjson_stringify(obj: any): StringifiedJSON {
	if (obj === undefined)
		return JSON_UNDEFINED

	return JSON.stringify(obj)
}

export function is_valid_stringified_json(sjson: StringifiedJSON): boolean {
	if (sjson === JSON_UNDEFINED)
		return true

	if (typeof sjson !== 'string') {
		console.error('is_valid_stringified_json failure 1!', { sjson })
		return false
	}

	try {
		JSON.parse(sjson)
		return true
	}
	catch {
		console.error('is_valid_stringified_json failure 2!', { sjson })
		return false
	}
}

// useful only due to enforcing types thanks to a symbol.
// Should do nothing.
export function control_sjson(sjson: StringifiedJSON): string {
	if (sjson === JSON_UNDEFINED)
		return 'undefined'

	return sjson
}
