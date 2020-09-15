/////////////////////

import { expect } from 'chai'
import sinon from 'sinon'
import deep_freeze from 'deep-freeze-strict'
import stable_stringify from 'json-stable-stringify'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo/practical-logger-node'
import {BaseRootState, get_schema_version_loose, WithRevision, WithSchemaVersion} from '@offirmo-private/state-utils'
import { State, DEMO_STATE, EngagementKey, SCHEMA_VERSION } from '@tbrpg/state'
import { create_action_force_set, create_action_noop } from '@tbrpg/interfaces'

import { LIB } from '../../consts'
import { get_lib_SEC } from '../../sec'

import { create, StorageKey, OPTIMIZATION_DELAY_MS } from '.'

/////////////////////

async function elapsed_time_ms(duration_ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(() => {
			setTimeout(resolve, 0)
		}, duration_ms)
	})
}

const SAFE_SETTLE_MS = 5 * OPTIMIZATION_DELAY_MS

describe(`${LIB} - store - local storage`, function() {
	const local_storage = createLocalStorage({ mode : 'memory' })
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'info', // change here if bug
	})
	let SEC = get_lib_SEC()
	const STUB_ACTION = create_action_noop()

	beforeEach(() => {
		SEC = get_lib_SEC().createChild()
			.injectDependencies({ logger })
		local_storage.clear()
	})
	afterEach(() => {
		local_storage.clear()
	})

	const DEMO_LATEST: Readonly<State> = DEMO_STATE
	const DEMO_LATEST_ALT: Readonly<State> = deep_freeze<State>({
		...DEMO_STATE,
		u_state: {
			...DEMO_STATE.u_state,
			revision: DEMO_STATE.u_state.revision - 3,
		}
	}) as any
	const DEMO_OLDER: Readonly<any> = deep_freeze<WithSchemaVersion & WithRevision>({
		schema_version: SCHEMA_VERSION - 1,
		revision: 22,
	})
	const DEMO_OLDEST: Readonly<any> = deep_freeze<WithSchemaVersion & WithRevision>({
		schema_version: SCHEMA_VERSION - 3,
		revision: 3,
	})

	describe('basic features', function () {

		describe('subscribe()', function() {

			context('on a non-initialized store', function () {

				it('should work', async () => {
					const store = create(SEC, local_storage)
					const listener = sinon.stub()

					listener.resetHistory()
					store.subscribe('test', listener)
					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '0').to.not.have.been.called // bc the store is not initialized yet

					store.set(DEMO_LATEST)
					await elapsed_time_ms(OPTIMIZATION_DELAY_MS)
					expect(listener, '1').to.have.been.calledOnce
					listener.resetHistory()

					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '1b').to.not.have.been.called

					store.on_dispatch(STUB_ACTION, DEMO_LATEST)
					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '2').to.not.have.been.called // bc no change

					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await elapsed_time_ms(OPTIMIZATION_DELAY_MS)
					expect(listener, '3').to.have.been.calledOnce
					listener.resetHistory()

					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '3b').to.not.have.been.called
				})
			})

			context('on an initialized store', function () {

				it('should work', async () => {
					const store = create(SEC, local_storage)
					store.set(DEMO_LATEST)
					await elapsed_time_ms(SAFE_SETTLE_MS)

					const listener = sinon.spy(
						() => console.log('listener called')
					)

					store.subscribe('test', listener)
					await elapsed_time_ms(OPTIMIZATION_DELAY_MS)
					expect(listener, '0').to.have.been.calledOnce // bc was already inited
					listener.resetHistory()

					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '0b').to.not.have.been.called

					listener.resetHistory()
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await elapsed_time_ms(OPTIMIZATION_DELAY_MS)
					expect(listener, '1').to.have.been.calledOnce // bc change

					listener.resetHistory()
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await elapsed_time_ms(SAFE_SETTLE_MS)
					expect(listener, '2').to.not.have.been.called // bc no change
				})
			})
		})
	})

	describe('safety feature -- get', function() {

		it('should crash when not initialized', () => {
			const store = create(SEC, local_storage)
			expect(store.get).to.throw('initialized')
		})
	})

	context('when local storage is not available', function () {
	})

	context('when starting fresh', function () {

		it('should work', async () => {
			const store = create(SEC, local_storage)

			await elapsed_time_ms(SAFE_SETTLE_MS)
			expect(local_storage, '0').to.have.lengthOf(0)

			store.set(DEMO_LATEST)

			await elapsed_time_ms(SAFE_SETTLE_MS)
			expect(local_storage, '1').to.have.lengthOf(1)
			expect(local_storage.getItem(StorageKey.bkp_main), '1').to.equal(stable_stringify(DEMO_LATEST))

			store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

			await elapsed_time_ms(SAFE_SETTLE_MS)
			expect(local_storage, '2').to.have.lengthOf(2)
			expect(local_storage.getItem(StorageKey.bkp_main), '2').to.equal(stable_stringify(DEMO_LATEST_ALT))
			expect(local_storage.getItem(StorageKey.bkp_minor), '2').to.equal(stable_stringify(DEMO_LATEST))

			store.on_dispatch(STUB_ACTION, DEMO_LATEST)

			await elapsed_time_ms(SAFE_SETTLE_MS)
			expect(local_storage, '3').to.have.lengthOf(2)
			expect(local_storage.getItem(StorageKey.bkp_main), '3').to.equal(stable_stringify(DEMO_LATEST))
			expect(local_storage.getItem(StorageKey.bkp_minor), '3').to.equal(stable_stringify(DEMO_LATEST_ALT))
		})
	})

	context('when starting with existing content', function () {

		context('when the content is totally crap', function () {
			const BAD_LS_CONTENT = '{bad json, maybe edited by hand}'
			beforeEach(() => {
				local_storage.setItem(StorageKey.bkp_main, BAD_LS_CONTENT)
			})

			it('should work', async () => {
				const store = create(SEC, local_storage)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				// nothing changed in LS
				expect(local_storage, 'unpersist ls size').to.have.lengthOf(1)
				expect(local_storage.getItem(StorageKey.bkp_main), 'unpersist main').to.equal(BAD_LS_CONTENT)
				// no state
				expect(store.get).to.throw('never init')
			})
		})

		context('when the content is crap but recoverable', function () {
			beforeEach(() => {
				local_storage.setItem(StorageKey.bkp_main, '{bad json, maybe edited by hand}')
				local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDEST))
			})

			it('should work', async () => {
				const store = create(SEC, local_storage)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'unpersist ls size').to.have.lengthOf(2)
				let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
				expect(get_schema_version_loose(main_bkp), 'unpersist main').to.equal(SCHEMA_VERSION)
				expect(store.get(), 'unpersist get').to.deep.equal(main_bkp)
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDEST))
			})
		})

		context('when the content is ok and full', function () {

			beforeEach(() => {
				local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_LATEST))
				local_storage.setItem(StorageKey.bkp_minor, stable_stringify(DEMO_LATEST_ALT))
				local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDER))
				local_storage.setItem(StorageKey.bkp_major_older, stable_stringify(DEMO_OLDEST))
			})

			it('should work', async () => {
				const store = create(SEC, local_storage)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'unpersist ls size').to.have.lengthOf(4)
				let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
				expect(get_schema_version_loose(main_bkp), 'unpersist main').to.equal(SCHEMA_VERSION)
				expect(store.get(), 'unpersist get').to.deep.equal(main_bkp)
				expect(local_storage.getItem(StorageKey.bkp_main), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST))
				expect(local_storage.getItem(StorageKey.bkp_minor), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST_ALT))
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'unpersist older').to.equal(stable_stringify(DEMO_OLDEST))

				// echo from dispatcher
				store.set(store.get())

				// no change
				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'set').to.have.lengthOf(4)
				expect(local_storage.getItem(StorageKey.bkp_main), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST))
				expect(local_storage.getItem(StorageKey.bkp_minor), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST_ALT))
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'unpersist older').to.equal(stable_stringify(DEMO_OLDEST))
				let previous_state = main_bkp

				store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'dispatch').to.have.lengthOf(4)
				expect(store.get(), 'dispatch').to.deep.equal(DEMO_LATEST_ALT)
				expect(local_storage.getItem(StorageKey.bkp_main), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST_ALT))
				expect(local_storage.getItem(StorageKey.bkp_minor), 'unpersist old').to.equal(stable_stringify(DEMO_LATEST))
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'unpersist older').to.equal(stable_stringify(DEMO_OLDEST))
			})
		})

		context('when the content is ok and partial', function () {
			beforeEach(() => {
				local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_OLDER))
				local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDEST))
			})

			it('should work', async () => {
				const store = create(SEC, local_storage)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'unpersist ls size').to.have.lengthOf(3)
				let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
				expect(get_schema_version_loose(main_bkp), 'unpersist main').to.equal(SCHEMA_VERSION)
				expect(store.get(), 'unpersist get').to.deep.equal(main_bkp)
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'unpersist older').to.equal(stable_stringify(DEMO_OLDEST))

				// echo from dispatcher
				store.set(store.get())

				// no change
				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'set').to.have.lengthOf(3)
				main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
				expect(get_schema_version_loose(main_bkp), 'set').to.equal(SCHEMA_VERSION)
				expect(store.get(), 'set').to.deep.equal(main_bkp)
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'set').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'set').to.equal(stable_stringify(DEMO_OLDEST))
				let previous_state = main_bkp

				store.on_dispatch(STUB_ACTION, DEMO_LATEST)

				await elapsed_time_ms(SAFE_SETTLE_MS)
				expect(local_storage, 'dispatch').to.have.lengthOf(4)
				main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
				expect(main_bkp, 'dispatch').to.deep.equal(DEMO_LATEST)
				expect(store.get(), 'dispatch').to.deep.equal(main_bkp)
				let previous_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_minor)!)
				expect(previous_bkp, 'dispatch').to.deep.equal(previous_state)
				expect(local_storage.getItem(StorageKey.bkp_major_old), 'dispatch').to.equal(stable_stringify(DEMO_OLDER))
				expect(local_storage.getItem(StorageKey.bkp_major_older), 'dispatch').to.equal(stable_stringify(DEMO_OLDEST))
			})
		})
	})
})
