// Note: the name of this file is because it appears in the dev tools!

const PATCHED_METHODS: Array<keyof Console> = [
	'debug', 'log', 'info', 'warn', 'error',

	'group', 'groupCollapsed', 'groupEnd',

	'table', 'trace', 'dir', 'dirxml', 'count',

	'assert',
]

/*

group: ƒ group()
groupCollapsed: ƒ groupCollapsed()
groupEnd: ƒ groupEnd()

debug: ƒ debug()
log: ƒ log()
info: ƒ info()
warn: ƒ warn()
error: ƒ error()

table: ƒ table()
trace: ƒ trace()
dir: ƒ dir()
dirxml: ƒ dirxml()
count: ƒ count()

// tricky, need extra work
clear: ƒ clear()
assert: ƒ assert()

// doesn't display anything:
countReset: ƒ countReset()
timeStamp: ƒ timeStamp()

// accessors
context: ƒ context()
memory: (...)

// to sort
profile: ƒ profile()
profileEnd: ƒ profileEnd()
time: ƒ time()
timeEnd: ƒ timeEnd()
timeLog: ƒ timeLog()
 */

interface GroupInvocation {
	params: any[]
	is_deployed: boolean
	is_effective: boolean
}

interface Options {
	uncollapse_level?: 'warn' | 'error',
	lazy?: boolean
	original_console?: Console,
}

const DEBUG = false

function install({ uncollapse_level = 'warn', lazy = true, original_console = console }: Options = {}): void {
	if (DEBUG) console.log('install', { uncollapse_level, lazy })

	const group_invocations: GroupInvocation[] = []
	// in node, group() calls console.log()
	// to prevent infinite loops
	let in_original_call = false

	const ORIGINAL_METHODS: { [k: string]: (...p: any[]) => void } = {}
	PATCHED_METHODS.forEach(k => {
		ORIGINAL_METHODS[k] = (original_console as any)[k]
	})

	function better_group(...p: any[]): void {
		if (DEBUG) ORIGINAL_METHODS.log('>>> before group', { lazy, depth: group_invocations.length}, `"${p[0]}"`)

		group_invocations.push({
			params: p,
			is_deployed: true,
			is_effective: !lazy,
		})
		if (!lazy) {
			in_original_call = true
			ORIGINAL_METHODS.group(...p)
			in_original_call = false
		}

		if (DEBUG) ORIGINAL_METHODS.log('<<< after group', { depth: group_invocations.length})
	}
	function better_groupCollapsed(...p: any[]): void {
		if (DEBUG) ORIGINAL_METHODS.log('>>> before groupCollapsed', { lazy, depth: group_invocations.length}, `"${p[0]}"`)

		group_invocations.push({
			params: p,
			is_deployed: false,
			is_effective: !lazy,
		})
		if (!lazy) {
			in_original_call = true
			ORIGINAL_METHODS.groupCollapsed(...p)
			in_original_call = false
		}

		if (DEBUG) ORIGINAL_METHODS.log('after groupCollapsed', { depth: group_invocations.length})
	}
	function better_groupEnd(...p: any[]): void {
		if (DEBUG) ORIGINAL_METHODS.log('>>> before groupEnd', { lazy, depth: group_invocations.length}, `"${p[0]}"`)

		const last_invocation = group_invocations.pop()
		if (last_invocation&& last_invocation.is_effective) {
			in_original_call = true
			ORIGINAL_METHODS.groupEnd(...p)
			in_original_call = false
		}

		if (DEBUG) ORIGINAL_METHODS.log('<<< after groupEnd', { lazy, depth: group_invocations.length})
	}

	function better_output(original_method: Console['log'], uncollapse: boolean, ...p: any[]): void {
		if (in_original_call) {
			return original_method(...p)
		}
		if (DEBUG) original_method('>>> before output', { depth: group_invocations.length}, `"${p[0]}"`)

		// lazily create groups
		// cancel collapsed if needed
		group_invocations.forEach(invocation => {
			const { is_effective, is_deployed, params } = invocation
			if (is_effective) return

			if (DEBUG) original_method('--- lazy call')

			if (uncollapse || is_deployed) {
				in_original_call = true
				ORIGINAL_METHODS.group(...params)
				in_original_call = false
				invocation.is_deployed = true
			}
			else {
				in_original_call = true
				ORIGINAL_METHODS.groupCollapsed(...params)
				in_original_call = false
				invocation.is_deployed = false
			}
			invocation.is_effective = true
		})

		if (DEBUG) original_method('--- output')

		// uncollapse parents if needed
		if (uncollapse) {
			const lowest_uncollapsed_index = group_invocations.findIndex(
				({ is_deployed }) => !is_deployed,
			)
			while (
				lowest_uncollapsed_index >= 0
				&& group_invocations.length
				&& group_invocations.length > lowest_uncollapsed_index
			) {
				better_groupEnd()
				ORIGINAL_METHODS.debug('(forced break out of collapsed group ↑ due to critical log ↓)')
			}
		}

		if (DEBUG) original_method('--- output')

		original_method(...p)
		if (DEBUG) original_method('<<<after output', { depth: group_invocations.length})
	}

	const patched = new Set<keyof Console>()

	console.group = better_group
	patched.add('group')
	console.groupCollapsed = better_groupCollapsed
	patched.add('groupCollapsed')
	console.groupEnd = better_groupEnd
	patched.add('groupEnd')

	console.warn = better_output.bind(null, ORIGINAL_METHODS.warn, uncollapse_level === 'warn')
	patched.add('warn')
	console.error = better_output.bind(null, ORIGINAL_METHODS.error, true)
	patched.add('error')
	console.assert = (assertion: boolean, ...args: any[]) => {
		if (assertion) {
			// do nothing
		}
		else {
			better_output(ORIGINAL_METHODS.assert, true, assertion, ...args)
		}
	}
	patched.add('assert')

	PATCHED_METHODS.forEach(method => {
		if (patched.has(method)) return

		;(console as any as { [k: string]: Console['log'] })[method] = better_output.bind(null, ORIGINAL_METHODS[method], false)
		patched.add(method)
	})
}

export { install as improve_console_groups }
export default install
