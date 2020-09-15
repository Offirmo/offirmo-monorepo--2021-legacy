import { expect } from 'chai'

import {
	nextTick as nextTick_p,
	setImmediate as setImmediate_p,
	requestIdleCallback,
} from './ponyfills'

import {
	elapsed_time_ms,
	end_of_current_event_loop,
	next_idle,
	all_planned_idle_executed, next_microtask,
} from './awaitable'


describe('underlying functions', function() {
	this.retries(3)

	it('should work in correct order', (done) => {
		const executions: string[] = []

		function callback(id: string) {
			executions.push(id)
		}

		// in reverse order to prove it works
		//requestIdleCallback(() => executions.push('idle'))
		setTimeout(() => callback('timeout--5'), 5)
		setTimeout(() => callback('timeout--4'), 4)
		setTimeout(() => callback('timeout--3'), 3)
		setTimeout(() => callback('timeout--2'), 2)

		// due to chrome cap, those 3x <=1ms are equivalent
		setTimeout(() => callback('timeout--1'), 1)
		setTimeout(() => callback('timeout--0'), 0)
		setTimeout(() => callback('timeout--undef'), undefined as any)

		setImmediate(() => callback('immediate'))
		Promise.resolve().then(() => callback('then'))
		queueMicrotask(() => callback('micro'))
		process.nextTick(() => callback('tick'))
		callback('sync')

		setTimeout(() => {
			//console.log(executions)
			expect(executions).to.deep.equal([
				'sync',
				'tick',
				'then', 'micro', // the same
				'immediate',
				'timeout--1', 'timeout--0', 'timeout--undef', // Chrome: timeout <=1ms are the same
				'timeout--2',
				'timeout--3',
				'timeout--4',
				'timeout--5',
			])
			done()
		}, 20)
	})

	it('should work in correct order -- setTimeout', (done) => {
		const executions: string[] = []

		function callback(id: string) {
			executions.push(id)
		}

		setTimeout(() => callback('timeout--1'), 1)
		setTimeout(() => callback('timeout--undef'), undefined as any)
		setTimeout(() => callback('timeout--0'), 0)
		setTimeout(() => callback('timeout--2'), 2)

		setTimeout(() => {
			//console.log(executions)
			expect(executions).to.deep.equal([
				'timeout--1', 'timeout--undef', 'timeout--0', // not reordered
				'timeout--2',
			])
			done()
		}, 20)
	})
})

describe('ponyfills', function() {
	this.retries(5)

	it('should work in correct order', (done) => {
		const executions: string[] = []

		function callback(id: string) {
			executions.push(id)
		}

		// actual expected order
		const EXPECTED_SYNC = [
			'sync',
		]
		const EXPECTED_MICROTASKS = [
			'tickP', 'tick',
			'then',
		]
		const EXPECTED_CURRENT_EVENT_LOOP = [
			'immediateP', 'immediate',
		]
		const EXPECTED_NEXT_EVENT_LOOP = [
			'timeout--1', 'timeout--0', 'timeout--undef', // interesting, timeout 0 and 1 are not reordered
		]
		const EXPECTED_IDLE = [
			'idleP',
		]
		const EXPECTED_LATER = [
			'timeout--20',
			'timeout--30',
			'timeout--40',
			'timeout--50',
		]

		// invocation in reverse order to prove it works
		setTimeout(() => callback('timeout--50'), 50)
		setTimeout(() => callback('timeout--40'), 40)
		setTimeout(() => callback('timeout--30'), 30)
		setTimeout(() => callback('timeout--20'), 20)
		requestIdleCallback(() => executions.push('idleP'))
		setTimeout(() => callback('timeout--1'), 1)
		setTimeout(() => callback('timeout--0'), 0)
		setTimeout(() => callback('timeout--undef'), undefined as any)
		setImmediate_p(() => callback('immediateP'))
		setImmediate(() => callback('immediate'))
		Promise.resolve().then(() => callback('then'))
		nextTick_p(() => callback('tickP'))
		process.nextTick(() => callback('tick'))
		callback('sync')

		expect(executions, 'sync').to.deep.equal([
			...EXPECTED_SYNC,
		])

		setTimeout(() => {
			//console.log(executions)
			expect(executions, 'a while').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
				...EXPECTED_CURRENT_EVENT_LOOP,
				...EXPECTED_NEXT_EVENT_LOOP,
				...EXPECTED_IDLE,
				...EXPECTED_LATER,
			])
			done()
		}, 50)

		/*return (async () => {
			/*await next_microtask()

			expect(executions, 'async asap').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
			])*/

			/*
			await end_of_current_event_loop()

			expect(executions, 'async').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
				...EXPECTED_CURRENT_EVENT_LOOP,
			])*/

			/*await next_idle()

			expect(executions, 'idle').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
				...EXPECTED_CURRENT_EVENT_LOOP,
				...EXPECTED_NEXT_EVENT_LOOP,
				...EXPECTED_IDLE,
			])

			await all_planned_idle_executed()

			//console.log(executions)
			expect(executions, 'all idle').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
				...EXPECTED_NEXT_EVENT_LOOP,
				...EXPECTED_IDLE,
			])

			await all_planned_idle_executed()
			await elapsed_time_ms(5)

			//console.log(executions)
			expect(executions, 'a while').to.deep.equal([
				...EXPECTED_SYNC,
				...EXPECTED_MICROTASKS,
				...EXPECTED_CURRENT_EVENT_LOOP,
				...EXPECTED_NEXT_EVENT_LOOP,
				...EXPECTED_IDLE,
				...EXPECTED_LATER,
			])
		})()*/
	})
})
