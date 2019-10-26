/////////////////////

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
// TODO Symbol?
type JSPrimitiveType = boolean | null | undefined | number | string

/////////////////////

interface NumberMap {
	[k: string]: number
}

/////////////////////

/* JSON
 * https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases
 */
type JSONPrimitiveType =
	| null
	| boolean
	| number
	| string
	| undefined // technically not allowed but added for convenience

interface JSONObject {
	[k: string]: JSON
}

type JSON =
	| JSONPrimitiveType
	| JSONObject
	| JSON[]

/////////////////////

interface I18nMessages {
	[k: string]: string | I18nMessages
}

/////////////////////

type ImmutabilityEnforcer = <T>(x: T) => Readonly<T>

/////////////////////

// isomorphic local storage
// copied from TS libs
interface Storage {
	readonly length: number
	clear(): void
	getItem(key: string): string | null
	removeItem(key: string): void
	setItem(key: string, value: string): void
}

/////////////////////

export {
	JSPrimitiveType,

	NumberMap,

	JSONPrimitiveType,
	JSONObject,
	JSON,

	I18nMessages,

	ImmutabilityEnforcer,

	Storage,
}
