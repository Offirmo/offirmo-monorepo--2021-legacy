import {
	Immutable,
	ImmutabilityEnforcer,
} from './immutable'


/////////////////////////////////////////////////

interface Test {
	foo: number
}
const t: Test = { foo: 42 }

/////////////////////////////////////////////////
function testAny(x: Immutable<any>): void {
	// XXX@ts-expect-error
	x.foo = 42 // hmmmm
}
testAny(t)
/*
function testAnyObj(x: Immutable<Object>): void {
	// xx@ts-expect-error
	x.foo = 42
	// xx@ts-expect-error
	x.foo[3].bar = 42
}
testAnyObj({})*/

/////////////////////////////////////////////////
function testAlt(x: Immutable<Test | number>): void {
	if (typeof x !== 'number') {
		// @ts-expect-error
		x.foo = 42
	}
}
testAlt(1)
testAlt(t)
// @ts-expect-error
testAlt({})
// @ts-expect-error
testAlt({bar: 42})

/////////////////////////////////////////////////
function testObject(s: Immutable<Test>): void {
	// @ts-expect-error
	s.foo = 42
}
testObject(t)
// @ts-expect-error
testObject({})
// @ts-expect-error
testTuple({bar: 42})

/////////////////////////////////////////////////
function testTuple(tuple: Immutable<[number, Test]>): void {
	// @ts-expect-error
	tuple[0] = 42
	// @ts-expect-error
	tuple[1].foo = 42
}
testTuple([42, {foo: 33}])
// @ts-expect-error
testTuple(null)
// @ts-expect-error
testTuple([])
// @ts-expect-error
testTuple(['foo'])

/////////////////////////////////////////////////

// @ts-expect-error TS6133
const t2: Immutable<Test> = t

// @ts-expect-error TS6133
const ie: ImmutabilityEnforcer = <T>(s: T | Immutable<T>) => s as Immutable<T>
