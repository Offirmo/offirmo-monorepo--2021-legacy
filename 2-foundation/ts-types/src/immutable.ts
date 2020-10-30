/////////////////////
// better than Readonly<>
// pb. error TS2345: Argument of type 'State' is not assignable to parameter of type 'Immutable<State>'
// pb. this breaks tuples :(

// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-557509399
export type ImmutablePrimitive = undefined | null | boolean | string | number | Function;

export type Immutable<T> =
	T extends ImmutablePrimitive ? T
		//: T extends Array<infer U> ? ImmutableArray<U> no need!
			: T extends Map<infer K, infer V> ? ImmutableMap<K, V>
				: T extends Set<infer M> ? ImmutableSet<M>
					: ImmutableObject<T>

export type ImmutableArray<T>  = ReadonlyArray<Immutable<T>>
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
export type ImmutableSet<T>    = ReadonlySet<Immutable<T>>
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }

/////////////////////

export type ImmutabilityEnforcer = <T>(x: T | Immutable<T>) => Immutable<T>

/////////////////////
