/////////////////////

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
// TODO Symbol?
export type JSPrimitiveType = boolean | null | undefined | number | string

/////////////////////

// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-557509399
export type ImmutablePrimitive = undefined | null | boolean | string | number | Function;

export type Immutable<T> =
	T extends ImmutablePrimitive ? T :
		T extends Array<infer U> ? ImmutableArray<U> :
			T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
				T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;

export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

/////////////////////

export interface NumberMap {
	[k: string]: number
}

/////////////////////

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

export interface I18nMessages {
	[k: string]: string | I18nMessages
}

/////////////////////

export type ImmutabilityEnforcer = <T>(x: T) => Readonly<T>

/////////////////////

// isomorphic local storage
// copied from TS libs
export interface Storage {
	readonly length: number
	clear(): void
	getItem(key: string): string | null
	removeItem(key: string): void
	setItem(key: string, value: string): void
}

/////////////////////
