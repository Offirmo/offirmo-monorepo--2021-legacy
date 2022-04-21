/////////////////////
// better than Readonly<>

// derived from https://github.com/microsoft/TypeScript/issues/13923#issuecomment-557509399
// improved
// then contributed back https://github.com/microsoft/TypeScript/issues/13923#issuecomment-716706151
export type ImmutablePrimitive = undefined | null | boolean | string | number | Function

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

// to cancel an Immutable (beware! You're breaking the contract!)
// Example usage: API outside of your control that refuse to take an Immutable, ex. ORM
export type Mutable<I> =
	I extends ImmutablePrimitive ? I
		: I extends ImmutableMap<infer IK, infer IV> ? MutableMap<IK, IV>
			: I extends ImmutableSet<infer IM> ? MutableSet<IM>
				: MutableObject<I>

export type MutableMap<IK, IV> = Map<Mutable<IK>, Mutable<IV>>
export type MutableSet<IT>     = Set<Mutable<IT>>
export type MutableObject<IT>  = { -readonly [K in keyof IT]: Mutable<IT[K]> }
