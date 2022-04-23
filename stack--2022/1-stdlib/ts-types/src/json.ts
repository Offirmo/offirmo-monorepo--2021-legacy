/////////////////////
// pb. error TS7053: Element implicitly has an 'any' type because expression of type '3' can't be used to index type 'Number'.

/* JSON
 * https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases
 * expanded for convenience / stricter typing
 */
export type JSONPrimitiveType =
	| null
	| boolean
	| number
	| string
	| undefined // technically not allowed but added for convenience

export interface JSONObject {
	[k: string]: JSON
}

export type JSON =
	| JSONPrimitiveType
	| JSONObject
	| JSON[]

/////////////////////
