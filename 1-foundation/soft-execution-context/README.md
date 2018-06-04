
# soft-execution-context

A fresh take on asynchronous contexts for node and browser. Inspired by zone.js and node domains.

Because I desperately need that for personal projects.

WORK IN PROGRESS, COMPLETELY EXPERIMENTAL FOR NOW

MVP v2 - 2018/05


## Introduction

Note: "Soft Execution Context" is abbreviated SEC everywhere.

Objectives:
* isomorphic, for node and browser
* reliably catch errors
  * either in a correctly chained path
  * or in any async path
* clear and exploitable errors
  * with an exploitable stack
  * with details
* basic dependency injection (DI), sort of React context
* can bubble events
  * ex. analytics can enrich details
* can abort a whole process and have a fallback
* not too slow (lots of forks)

BE DEFENSIVE !!!


## API

### Concepts

#### Hierarchy

Each SEC is linked to a parent, forming a graph.

Thus a SEC is usually created from a parent with `parentSEC.createChild()`.

There is always a unique (singleton) top SEC. It is lazily created on call of `getRootSEC()`.

However, this root SEC can be customized like any other SEC.


### requisites
babel-polyfill may be needed

### Methods

```js

SEC.injectDependencies({
	foo: 42,
})
const { ENV, DEBUG, SEC, logger, foo } = SEC.getInjectedDependencies()


SEC.xTry(operation, ({SEC, logger}) => {
	...
})
SEC.xTryCatch(...) // <-- used at top level

SEC.xPromiseCatch(operation, promise)

SEC.xPromiseTry(operation, ({SEC, logger}) => {
	...
})
SEC.xPromiseTryCatch(...)

SEC.setLogicalStack({
	module: LIB,
	operation: ...
})

SEC.getLogicalStack()
SEC.getShortLogicalStack()
```

### Event emitter

All SEC are sharing a common event emitter. Please do NOT abuse!

DO NOT EMIT SEC events, it's usually not what you want to do.

Events:
- `final-error`: an error than no SEC can handle or mitigate (usually a crash).
  This event should be listened to by final reporters, like Sentry,
  or to display a crash report.



### internals

```
{
	sid: number
	parent: parent_state || null
	plugins: {
		dependency_injection: {
			context: {  -> prototypically inherited <-
				...
				logger = console
				ENV = NODE_ENV || 'development'
				DEBUG = false // TOREVIEW
			}
		},
		error_handling: {
			details: {  -> prototypically inherited <-
				...
			},
		},
		logical_stack: {
			stack: {  -> prototypically inherited <-
				module: ...
				operation: ...
			} 
		},
	},
	cache: { // per-SEC cache for complex computations
	},
}

```

```js
SEC._decorateErrorWithDetails(err)
SEC._decorateErrorWithLogicalStack(err)

flattenToOwn(object)
_flattenSEC(SEC)
_getSECStatePath(SEC)
```
